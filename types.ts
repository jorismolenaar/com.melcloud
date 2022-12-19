import MELCloudDeviceAta from './drivers/melcloud/device'
import MELCloudDriverAta from './drivers/melcloud/driver'
import MELCloudDeviceAtw from './drivers/melcloud_atw/device'
import MELCloudDriverAtw from './drivers/melcloud_atw/driver'

export type MELCloudDevice = MELCloudDeviceAta | MELCloudDeviceAtw
export type MELCloudDriver = MELCloudDriverAta | MELCloudDriverAtw

export type Settings = Record<string, any>

interface SetCapabilitiesAta {
  onoff?: boolean
  operation_mode?: string
  target_temperature?: number
  fan_power?: number
  vertical?: string
  horizontal?: string
}

interface SetCapabilitiesAtw {
  onoff?: boolean
  'operation_mode_zone.zone1'?: string
  'operation_mode_zone_with_cool.zone1'?: string
  'operation_mode_zone.zone2'?: string
  'operation_mode_zone_with_cool.zone2'?: string
  'onoff.forced_hot_water'?: boolean
  target_temperature?: number
  'target_temperature.zone2'?: number
  'target_temperature.zone1_flow_cool'?: number
  'target_temperature.zone1_flow_heat'?: number
  'target_temperature.zone2_flow_cool'?: number
  'target_temperature.zone2_flow_heat'?: number
  'target_temperature.tank_water'?: number
}

export type SetCapabilities<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? SetCapabilitiesAtw
  : SetCapabilitiesAta

interface GetCapabilitiesAta {
  measure_temperature: number
}

interface GetCapabilitiesAtw {
  eco_hot_water: boolean
  measure_temperature: number
  'measure_temperature.zone2': number
  'measure_temperature.outdoor': number
  'measure_temperature.tank_water': number
  operation_mode_state: number
}

interface ListCapabilitiesAta {
  'measure_power.wifi': number
}

interface ListCapabilitiesAtw {
  'alarm_generic.booster_heater1': boolean
  'alarm_generic.booster_heater2': boolean
  'alarm_generic.booster_heater2_plus': boolean
  'alarm_generic.defrost_mode': boolean
  'alarm_generic.immersion_heater': boolean
  'measure_power.heat_pump_frequency': boolean
  'measure_power.wifi': number
  'measure_temperature.flow': boolean
  'measure_temperature.return': boolean
}

interface ReportCapabilitiesAta {
  'meter_power.hourly_consumed': number
  'meter_power.hourly_consumed_auto': number
  'meter_power.hourly_consumed_cooling': number
  'meter_power.hourly_consumed_dry': number
  'meter_power.hourly_consumed_fan': number
  'meter_power.hourly_consumed_heating': number
  'meter_power.hourly_consumed_other': number
  'meter_power.daily_consumed': number
  'meter_power.daily_consumed_auto': number
  'meter_power.daily_consumed_cooling': number
  'meter_power.daily_consumed_dry': number
  'meter_power.daily_consumed_fan': number
  'meter_power.daily_consumed_heating': number
  'meter_power.daily_consumed_other': number
  'meter_power.total_consumed': number
  'meter_power.total_consumed_auto': number
  'meter_power.total_consumed_cooling': number
  'meter_power.total_consumed_dry': number
  'meter_power.total_consumed_fan': number
  'meter_power.total_consumed_heating': number
  'meter_power.total_consumed_other': number
}

interface ReportCapabilitiesAtw {
  'meter_power.daily_cop': number
  'meter_power.daily_cop_cooling': number
  'meter_power.daily_cop_heating': number
  'meter_power.daily_cop_hotwater': number
  'meter_power.daily_consumed': number
  'meter_power.daily_consumed_cooling': number
  'meter_power.daily_consumed_heating': number
  'meter_power.daily_consumed_hotwater': number
  'meter_power.daily_produced': number
  'meter_power.daily_produced_cooling': number
  'meter_power.daily_produced_heating': number
  'meter_power.daily_produced_hotwater': number
  'meter_power.total_cop': number
  'meter_power.total_cop_cooling': number
  'meter_power.total_cop_heating': number
  'meter_power.total_cop_hotwater': number
  'meter_power.total_consumed': number
  'meter_power.total_consumed_cooling': number
  'meter_power.total_consumed_heating': number
  'meter_power.total_consumed_hotwater': number
  'meter_power.total_produced': number
  'meter_power.total_produced_cooling': number
  'meter_power.total_produced_heating': number
  'meter_power.total_produced_hotwater': number
}

export type ReportCapabilities<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? ReportCapabilitiesAtw
  : ReportCapabilitiesAta

export type SetCapability<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? keyof SetCapabilitiesAtw
  : keyof SetCapabilitiesAta

export type ExtendedSetCapability<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? keyof SetCapabilitiesAtw
  : keyof SetCapabilitiesAta | 'thermostat_mode'

export type GetCapability<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? keyof GetCapabilitiesAtw
  : keyof GetCapabilitiesAta

export type ListCapability<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? keyof ListCapabilitiesAtw
  : keyof ListCapabilitiesAta

export type ReportCapability<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? keyof ReportCapabilitiesAtw
  : keyof ReportCapabilitiesAta

export type Capability<T extends MELCloudDevice> = SetCapability<T> | GetCapability<T> | ListCapability<T> | ReportCapability<T>

interface SetDeviceDataAta {
  EffectiveFlags: number
  OperationMode?: number
  Power?: boolean
  SetTemperature?: number
  SetFanSpeed?: number
  VaneVertical?: number
  VaneHorizontal?: number
}

interface SetDeviceDataAtw {
  EffectiveFlags: number
  ForcedHotWaterMode?: boolean
  OperationModeZone1?: number
  OperationModeZone2?: number
  OutdoorTemperature?: number
  Power?: boolean
  SetCoolFlowTemperatureZone1?: number
  SetCoolFlowTemperatureZone2?: number
  SetHeatFlowTemperatureZone1?: number
  SetHeatFlowTemperatureZone2?: number
  SetTankWaterTemperature?: number
  SetTemperatureZone1?: number
  SetTemperatureZone2?: number
}

type SetDeviceData<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? SetDeviceDataAtw
  : SetDeviceDataAta

interface GetDeviceDataAta {
  readonly RoomTemperature: number
}

interface GetDeviceDataAtw {
  readonly EcoHotWater: boolean
  readonly OperationMode: number
  readonly OutdoorTemperature: number
  readonly RoomTemperatureZone1: number
  readonly RoomTemperatureZone2: number
  readonly TankWaterTemperature: number
}

type GetDeviceData<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? GetDeviceDataAtw
  : GetDeviceDataAta

interface ListDeviceDataAta {
  readonly CanCool: boolean
  readonly DeviceType: number
  readonly HasZone2: boolean
  readonly WifiSignalStrength: number
}

interface ListDeviceDataAtw {
  readonly CanCool: boolean
  readonly DeviceType: number
  readonly HasZone2: boolean
  readonly WifiSignalStrength: number
  readonly BoosterHeater1Status: boolean
  readonly BoosterHeater2Status: boolean
  readonly BoosterHeater2PlusStatus: boolean
  readonly DefrostMode: number
  readonly FlowTemperature: number
  readonly HeatPumpFrequency: number
  readonly ImmersionHeaterStatus: boolean
  readonly ReturnTemperature: number
}

type ListDeviceData<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? ListDeviceDataAtw
  : ListDeviceDataAta

export interface SetCapabilityMapping<T extends MELCloudDevice> {
  tag: Exclude<keyof SetDeviceData<T>, 'EffectiveFlags'>
  effectiveFlag: bigint
}

export interface GetCapabilityMapping<T extends MELCloudDevice> {
  tag: keyof GetDeviceData<T>
}

export interface ListCapabilityMapping<T extends MELCloudDevice> {
  tag: keyof ListDeviceData<T>
}

export const setCapabilityMappingAta: Record<SetCapability<MELCloudDeviceAta>, SetCapabilityMapping<MELCloudDeviceAta>> = {
  onoff: {
    tag: 'Power',
    effectiveFlag: 0x1n
  },
  operation_mode: {
    tag: 'OperationMode',
    effectiveFlag: 0x2n
  },
  target_temperature: {
    tag: 'SetTemperature',
    effectiveFlag: 0x4n
  },
  fan_power: {
    tag: 'SetFanSpeed',
    effectiveFlag: 0x8n
  },
  vertical: {
    tag: 'VaneVertical',
    effectiveFlag: 0x10n
  },
  horizontal: {
    tag: 'VaneHorizontal',
    effectiveFlag: 0x100n
  }
} as const

export const setCapabilityMappingAtw: Record<SetCapability<MELCloudDeviceAtw>, SetCapabilityMapping<MELCloudDeviceAtw>> = {
  onoff: {
    tag: 'Power',
    effectiveFlag: 0x1n
  },
  'operation_mode_zone.zone1': {
    tag: 'OperationModeZone1',
    effectiveFlag: 0x8n
  },
  'operation_mode_zone_with_cool.zone1': {
    tag: 'OperationModeZone1',
    effectiveFlag: 0x8n
  },
  'operation_mode_zone.zone2': {
    tag: 'OperationModeZone2',
    effectiveFlag: 0x10n
  },
  'operation_mode_zone_with_cool.zone2': {
    tag: 'OperationModeZone2',
    effectiveFlag: 0x10n
  },
  'onoff.forced_hot_water': {
    tag: 'ForcedHotWaterMode',
    effectiveFlag: 0x10000n
  },
  target_temperature: {
    tag: 'SetTemperatureZone1',
    effectiveFlag: 0x200000080n
  },
  'target_temperature.zone2': {
    tag: 'SetTemperatureZone2',
    effectiveFlag: 0x800000200n
  },
  'target_temperature.zone1_flow_cool': {
    tag: 'SetCoolFlowTemperatureZone1',
    effectiveFlag: 0x1000000000000n
  },
  'target_temperature.zone1_flow_heat': {
    tag: 'SetHeatFlowTemperatureZone1',
    effectiveFlag: 0x1000000000000n
  },
  'target_temperature.zone2_flow_cool': {
    tag: 'SetCoolFlowTemperatureZone2',
    effectiveFlag: 0x1000000000000n
  },
  'target_temperature.zone2_flow_heat': {
    tag: 'SetHeatFlowTemperatureZone2',
    effectiveFlag: 0x1000000000000n
  },
  'target_temperature.tank_water': {
    tag: 'SetTankWaterTemperature',
    effectiveFlag: 0x1000000000020n
  }
} as const

export const getCapabilityMappingAta: Record<GetCapability<MELCloudDeviceAta>, GetCapabilityMapping<MELCloudDeviceAta>> = {
  measure_temperature: {
    tag: 'RoomTemperature'
  }
} as const

export const getCapabilityMappingAtw: Record<GetCapability<MELCloudDeviceAtw>, GetCapabilityMapping<MELCloudDeviceAtw>> = {
  eco_hot_water: {
    tag: 'EcoHotWater'
  },
  measure_temperature: {
    tag: 'RoomTemperatureZone1'
  },
  'measure_temperature.zone2': {
    tag: 'RoomTemperatureZone2'
  },
  'measure_temperature.outdoor': {
    tag: 'OutdoorTemperature'
  },
  'measure_temperature.tank_water': {
    tag: 'TankWaterTemperature'
  },
  operation_mode_state: {
    tag: 'OperationMode'
  }
} as const

export const listCapabilityMappingAta: Record<ListCapability<MELCloudDeviceAta>, ListCapabilityMapping<MELCloudDeviceAta>> = {
  'measure_power.wifi': {
    tag: 'WifiSignalStrength'
  }
} as const

export const listCapabilityMappingAtw: Record<ListCapability<MELCloudDeviceAtw>, ListCapabilityMapping<MELCloudDeviceAtw>> = {
  'alarm_generic.booster_heater1': {
    tag: 'BoosterHeater1Status'
  },
  'alarm_generic.booster_heater2': {
    tag: 'BoosterHeater2Status'
  },
  'alarm_generic.booster_heater2_plus': {
    tag: 'BoosterHeater2PlusStatus'
  },
  'alarm_generic.defrost_mode': {
    tag: 'DefrostMode'
  },
  'alarm_generic.immersion_heater': {
    tag: 'ImmersionHeaterStatus'
  },
  'measure_power.heat_pump_frequency': {
    tag: 'HeatPumpFrequency'
  },
  'measure_power.wifi': {
    tag: 'WifiSignalStrength'
  },
  'measure_temperature.flow': {
    tag: 'FlowTemperature'
  },
  'measure_temperature.return': {
    tag: 'ReturnTemperature'
  }
} as const

interface DeviceInfoAta {
  readonly name: string
  readonly data: {
    readonly id: number
    readonly buildingid: number
  }
}

interface DeviceInfoAtw {
  readonly name: string
  readonly data: {
    readonly id: number
    readonly buildingid: number
  }
  readonly store: {
    readonly canCool: boolean
    readonly hasZone2: boolean
  }
  readonly capabilities: Array<Capability<MELCloudDeviceAtw>>
}

export type DeviceInfo<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? DeviceInfoAtw
  : DeviceInfoAta

export type FlowArgsAta = { device: MELCloudDeviceAta } & { [capability in SetCapability<MELCloudDeviceAta>]: string }

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginPostData {
  readonly AppVersion: '1.9.3.0'
  readonly Email: string
  readonly Password: string
  readonly Persist: true
}

export interface LoginData {
  readonly LoginData?: {
    readonly ContextKey: string
    readonly Expiry: string
  }
}

interface BaseListDevice {
  readonly BuildingID: number
  readonly DeviceID: number
  readonly DeviceName: string
}

export type ListDevice<T extends MELCloudDevice> = BaseListDevice & { Device: ListDeviceData<T> }

export interface Building<T extends MELCloudDevice> {
  readonly Structure: {
    readonly Devices: Array<ListDevice<T>>
    readonly Areas: Array<{
      readonly Devices: Array<ListDevice<T>>
    }>
    readonly Floors: Array<{
      readonly Devices: Array<ListDevice<T>>
      readonly Areas: Array<{
        readonly Devices: Array<ListDevice<T>>
      }>
    }>
  }
}

export type ListDevices<T extends MELCloudDevice> = Record<number, ListDevice<T>>

export type UpdateData<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? Required<Readonly<SetDeviceData<MELCloudDeviceAtw>>>
  : Required<Readonly<SetDeviceData<MELCloudDeviceAta>>>

export type PostData<T extends MELCloudDevice> = UpdateData<T> & {
  readonly DeviceID: number
  readonly HasPendingCommand: true
}

export type Data<T extends MELCloudDevice> = UpdateData<T> & GetDeviceData<T>

export interface ReportPostData {
  readonly DeviceID: number
  readonly FromDate: string
  readonly ToDate: string
  readonly UseCurrency: false
}

interface ReportDataAta {
  readonly Heating: number[]
  readonly Cooling: number[]
  readonly Auto: number[]
  readonly Dry: number[]
  readonly Fan: number[]
  readonly Other: number[]
  readonly TotalHeatingConsumed: number
  readonly TotalCoolingConsumed: number
  readonly TotalAutoConsumed: number
  readonly TotalDryConsumed: number
  readonly TotalFanConsumed: number
  readonly TotalOtherConsumed: number
  readonly UsageDisclaimerPercentages: string
}

interface ReportDataAtw {
  readonly TotalHeatingConsumed: number
  readonly TotalCoolingConsumed: number
  readonly TotalHotWaterConsumed: number
  readonly TotalHeatingProduced: number
  readonly TotalCoolingProduced: number
  readonly TotalHotWaterProduced: number
}

export type ReportData<T extends MELCloudDevice> = T extends MELCloudDeviceAtw
  ? ReportDataAtw
  : ReportDataAta
