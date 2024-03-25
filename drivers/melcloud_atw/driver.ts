import {
  type Capabilities,
  type GetCapabilityTagMapping,
  type ListCapabilityTagMapping,
  type ReportCapabilityTagMapping,
  type SetCapabilityTagMapping,
  type Store,
  type StoreMapping,
  getCapabilityTagMappingAtw,
  listCapabilityTagMappingAtw,
  reportCapabilityTagMappingAtw,
  setCapabilityTagMappingAtw,
  storeMappingAtw,
} from '../../types'
import { DeviceType, effectiveFlagsAtw } from '../../melcloud/types'
import BaseMELCloudDriver from '../../bases/driver'

export = class AtwDriver extends BaseMELCloudDriver<'Atw'> {
  public readonly effectiveFlags: typeof effectiveFlagsAtw = effectiveFlagsAtw

  public readonly getCapabilityTagMapping: GetCapabilityTagMapping['Atw'] =
    getCapabilityTagMappingAtw

  public readonly listCapabilityTagMapping: ListCapabilityTagMapping['Atw'] =
    listCapabilityTagMappingAtw

  public readonly reportCapabilityTagMapping: ReportCapabilityTagMapping['Atw'] =
    reportCapabilityTagMappingAtw

  public readonly setCapabilityTagMapping: SetCapabilityTagMapping['Atw'] =
    setCapabilityTagMappingAtw

  protected readonly deviceType: DeviceType = DeviceType.Atw

  protected readonly storeMapping: StoreMapping['Atw'] = storeMappingAtw

  readonly #coolZone1Capabilities: (keyof Capabilities['Atw'])[] = [
    'target_temperature.flow_cool',
    'operation_mode_zone_with_cool',
    'boolean.cooling_zone1',
    'boolean.prohibit_cooling_zone1',
  ]

  readonly #coolZone2Capabilities: (keyof Capabilities['Atw'])[] = [
    'target_temperature.flow_cool_zone2',
    'operation_mode_zone_with_cool.zone2',
    'boolean.cooling_zone2',
    'boolean.prohibit_cooling_zone2',
  ]

  readonly #zone1Capabilities: (keyof Capabilities['Atw'])[] = [
    'onoff',
    'onoff.forced_hot_water',
    'measure_temperature',
    'measure_temperature.outdoor',
    'measure_temperature.flow',
    'measure_temperature.return',
    'measure_temperature.tank_water',
    'target_temperature',
    'target_temperature.tank_water',
    'target_temperature.flow_heat',
    'operation_mode_state',
    'operation_mode_state.hot_water',
    'operation_mode_state.zone1',
    'measure_power.heat_pump_frequency',
    'measure_power',
    'measure_power.produced',
    'boolean.heating_zone1',
    'boolean.idle_zone1',
    'boolean.prohibit_hot_water',
    'boolean.prohibit_heating_zone1',
  ]

  readonly #zone2Capabilities: (keyof Capabilities['Atw'])[] = [
    'measure_temperature.zone2',
    'target_temperature.zone2',
    'target_temperature.flow_heat_zone2',
    'operation_mode_state.zone2',
    'boolean.heating_zone2',
    'boolean.idle_zone2',
    'boolean.prohibit_heating_zone2',
  ]

  public getRequiredCapabilities({
    canCool,
    hasZone2,
  }: Store['Atw']): string[] {
    return [
      ...this.#zone1Capabilities,
      ...(canCool ? this.#coolZone1Capabilities : ['operation_mode_zone']),
      ...(hasZone2
        ? [
            ...this.#zone2Capabilities,
            ...(canCool
              ? this.#coolZone2Capabilities
              : ['operation_mode_zone.zone2']),
          ]
        : []),
    ]
  }
}
