import { BaseEnergyReportAta } from './base'

import type { EnergyReportMode } from '../../types'

export class EnergyReportTotalAta extends BaseEnergyReportAta {
  protected duration = { days: 1 }

  protected interval = { days: 1 }

  protected mode: EnergyReportMode = 'total'

  protected values = { hour: 1, millisecond: 0, minute: 5, second: 0 }
}
