import type {
  Building,
  ErrorLogData,
  ErrorLogPostData,
  FailureData,
  FrostProtectionData,
  FrostProtectionPostData,
  GetDeviceData,
  HeatPumpType,
  HolidayModeData,
  HolidayModePostData,
  HomeyClass,
  HomeySettings,
  LoginData,
  LoginPostData,
  MELCloudDriver,
  PostData,
  ReportData,
  ReportPostData,
  SuccessData,
  TypedString,
} from '../types'
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type MELCloudApp from '../app'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type APIClass = new (...args: any[]) => {
  readonly api: AxiosInstance
  readonly apiError: (
    postData: ErrorLogPostData,
  ) => Promise<{ data: ErrorLogData[] | FailureData }>
  readonly apiGet: <D extends MELCloudDriver>(
    id: string,
    buildingId: string,
  ) => Promise<{ data: GetDeviceData<D> & { readonly EffectiveFlags: 0 } }>
  readonly apiGetFrostProtection: (
    id: number,
  ) => Promise<{ data: FrostProtectionData }>
  readonly apiGetHolidayMode: (id: number) => Promise<{ data: HolidayModeData }>
  readonly apiUpdateFrostProtection: (
    postData: FrostProtectionPostData,
  ) => Promise<{ data: FailureData | SuccessData }>
  readonly apiUpdateHolidayMode: (
    postData: HolidayModePostData,
  ) => Promise<{ data: FailureData | SuccessData }>
  readonly apiList: () => Promise<{ data: Building[] }>
  readonly apiLogin: (postData: LoginPostData) => Promise<{ data: LoginData }>
  readonly apiReport: <D extends MELCloudDriver>(
    postData: ReportPostData,
  ) => Promise<{ data: ReportData<D> }>
  readonly apiSet: <D extends MELCloudDriver>(
    heatPumpType: keyof typeof HeatPumpType,
    postData: PostData<D>,
  ) => Promise<{ data: GetDeviceData<D> }>
  readonly getHomeySetting: <K extends keyof HomeySettings>(
    setting: K,
  ) => HomeySettings[K]
}

const LOGIN_URL = '/Login/ClientLogin'

export const getErrorMessage = (error: unknown): string =>
  axios.isAxiosError(error) || error instanceof Error
    ? error.message
    : String(error)

const getAPICallData = (
  object: AxiosError | AxiosResponse | InternalAxiosRequestConfig,
): string[] => {
  const isError = axios.isAxiosError(object)
  const isResponse = Boolean(
    'status' in object || (isError && typeof object.response !== 'undefined'),
  )
  const config: InternalAxiosRequestConfig | undefined =
    isResponse || isError
      ? (object as AxiosError | AxiosResponse).config
      : (object as InternalAxiosRequestConfig)
  let response: AxiosResponse | null = null
  if (isResponse) {
    response = isError ? object.response ?? null : (object as AxiosResponse)
  }
  return (
    [
      `API ${isResponse ? 'response' : 'request'}:`,
      config?.method?.toUpperCase(),
      config?.url,
      config?.params,
      isResponse ? response?.headers : config?.headers,
      response?.status,
      isResponse ? (object as AxiosResponse).data : config?.data,
      isError ? object.message : null,
    ]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((log: any) => typeof log !== 'undefined' && log !== null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((log: any): string =>
        typeof log === 'object' ? JSON.stringify(log, null, 2) : String(log),
      )
  )
}

// eslint-disable-next-line max-lines-per-function
const withAPI = <T extends HomeyClass>(base: T): APIClass & T =>
  class WithAPI extends base {
    public readonly api: AxiosInstance = axios.create()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      super(...args)
      this.setupAxiosInterceptors()
    }

    public getHomeySetting<K extends keyof HomeySettings>(
      setting: TypedString<K>,
    ): HomeySettings[K] {
      return this.homey.settings.get(setting) as HomeySettings[K]
    }

    public async apiLogin(
      postData: LoginPostData,
    ): Promise<{ data: LoginData }> {
      return this.api.post<LoginData>(LOGIN_URL, postData)
    }

    public async apiList(): Promise<{ data: Building[] }> {
      return this.api.get<Building[]>('/User/ListDevices')
    }

    public async apiSet<D extends MELCloudDriver>(
      heatPumpType: keyof typeof HeatPumpType,
      postData: PostData<D>,
    ): Promise<{ data: GetDeviceData<D> }> {
      return this.api.post<GetDeviceData<D>>(
        `/Device/Set${heatPumpType}`,
        postData,
      )
    }

    public async apiGet<D extends MELCloudDriver>(
      id: string,
      buildingId: string,
    ): Promise<{ data: GetDeviceData<D> & { readonly EffectiveFlags: 0 } }> {
      return this.api.get<GetDeviceData<D> & { readonly EffectiveFlags: 0 }>(
        '/Device/Get',
        { params: { buildingId, id } },
      )
    }

    public async apiReport<D extends MELCloudDriver>(
      postData: ReportPostData,
    ): Promise<{ data: ReportData<D> }> {
      return this.api.post<ReportData<D>>('/EnergyCost/Report', postData)
    }

    public async apiError(
      postData: ErrorLogPostData,
    ): Promise<{ data: ErrorLogData[] | FailureData }> {
      return this.api.post<ErrorLogData[] | FailureData>(
        '/Report/GetUnitErrorLog2',
        postData,
      )
    }

    public async apiGetFrostProtection(
      id: number,
    ): Promise<{ data: FrostProtectionData }> {
      return this.api.get<FrostProtectionData>('/FrostProtection/GetSettings', {
        params: { id, tableName: 'DeviceLocation' },
      })
    }

    public async apiUpdateFrostProtection(
      postData: FrostProtectionPostData,
    ): Promise<{ data: FailureData | SuccessData }> {
      return this.api.post<FailureData | SuccessData>(
        '/FrostProtection/Update',
        postData,
      )
    }

    public async apiGetHolidayMode(
      id: number,
    ): Promise<{ data: HolidayModeData }> {
      return this.api.get<HolidayModeData>('/HolidayMode/GetSettings', {
        params: { id, tableName: 'DeviceLocation' },
      })
    }

    public async apiUpdateHolidayMode(
      postData: HolidayModePostData,
    ): Promise<{ data: FailureData | SuccessData }> {
      return this.api.post<FailureData | SuccessData>(
        '/HolidayMode/Update',
        postData,
      )
    }

    private setupAxiosInterceptors(): void {
      this.api.interceptors.request.use(
        (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig =>
          this.handleRequest(config),
        async (error: AxiosError): Promise<AxiosError> =>
          this.handleError(error),
      )
      this.api.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse =>
          this.handleResponse(response),
        async (error: AxiosError): Promise<AxiosError> =>
          this.handleError(error),
      )
    }

    private handleRequest(
      config: InternalAxiosRequestConfig,
    ): InternalAxiosRequestConfig {
      const updatedConfig: InternalAxiosRequestConfig = { ...config }
      updatedConfig.headers['X-MitsContextKey'] =
        (this.homey.settings.get(
          'contextKey',
        ) as HomeySettings['contextKey']) ?? ''
      this.log(getAPICallData(updatedConfig).join('\n'))
      return updatedConfig
    }

    private handleResponse(response: AxiosResponse): AxiosResponse {
      this.log(getAPICallData(response).join('\n'))
      return response
    }

    private async handleError(error: AxiosError): Promise<AxiosError> {
      const app: MELCloudApp = this.homey.app as MELCloudApp
      const apiCallData: string[] = getAPICallData(error)
      this.error(apiCallData.join('\n'))
      if (
        error.response?.status === axios.HttpStatusCode.Unauthorized &&
        app.retry &&
        error.config?.url !== LOGIN_URL
      ) {
        app.handleRetry()
        const loggedIn: boolean = await app.login()
        if (loggedIn && error.config) {
          return this.api.request(error.config)
        }
      }
      await this.setErrorWarning(apiCallData[apiCallData.length - 1])
      return Promise.reject(error)
    }

    private async setErrorWarning(warning: string | null): Promise<void> {
      if (this.setWarning) {
        await this.setWarning(warning)
      }
    }
  }

export default withAPI
