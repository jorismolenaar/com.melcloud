import {
  type FlowArgs,
  type GetCapabilityTagMappingErv,
  type ListCapabilityTagMappingErv,
  type ReportCapabilityTagMappingErv,
  type SetCapabilities,
  type SetCapabilityTagMappingErv,
  type Store,
  getCapabilityTagMappingErv,
  listCapabilityTagMappingErv,
  reportCapabilityTagMappingErv,
  setCapabilityTagMappingErv,
} from '../../types/types'
import { HeatPumpType, effectiveFlagsErv } from '../../types/MELCloudAPITypes'
import BaseMELCloudDriver from '../../bases/driver'

export = class ErvDriver extends BaseMELCloudDriver<'Erv'> {
  public readonly effectiveFlags: typeof effectiveFlagsErv = effectiveFlagsErv

  public readonly getCapabilityTagMapping: GetCapabilityTagMappingErv =
    getCapabilityTagMappingErv

  public readonly listCapabilityTagMapping: ListCapabilityTagMappingErv =
    listCapabilityTagMappingErv

  public readonly reportCapabilityTagMapping: ReportCapabilityTagMappingErv =
    reportCapabilityTagMappingErv

  public readonly setCapabilityTagMapping: SetCapabilityTagMappingErv =
    setCapabilityTagMappingErv

  protected readonly deviceType: HeatPumpType = HeatPumpType.Erv

  readonly #flowCapabilities: (keyof SetCapabilities<ErvDriver>)[] = [
    'ventilation_mode',
    'fan_power',
  ]

  public getRequiredCapabilities({
    hasCO2Sensor,
    hasPM25Sensor,
  }: Store): string[] {
    return [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...(this.manifest.capabilities as string[]).filter(
        (capability: string) =>
          !['measure_co2', 'measure_pm25', 'measure_power.wifi'].includes(
            capability,
          ),
      ),
      ...(hasCO2Sensor ? ['measure_co2'] : []),
      ...(hasPM25Sensor ? ['measure_pm25'] : []),
    ]
  }

  protected registerRunListeners(): void {
    this.#flowCapabilities.forEach(
      (capability: keyof SetCapabilities<ErvDriver>) => {
        if (capability !== 'fan_power') {
          this.homey.flow
            .getConditionCard(`${capability}_erv_condition`)
            .registerRunListener(
              (args: FlowArgs<ErvDriver>): boolean =>
                args[capability] === args.device.getCapabilityValue(capability),
            )
        }
        this.homey.flow
          .getActionCard(`${capability}_erv_action`)
          .registerRunListener(
            async (args: FlowArgs<ErvDriver>): Promise<void> => {
              await args.device.onCapability(capability, args[capability])
            },
          )
      },
    )
  }
}
