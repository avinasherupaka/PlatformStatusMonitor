export const stackName = process.env.AWS_LAMBDA_FUNCTION_NAME.replace(/-[^-]*$/, '')
export const ServiceComponentTable = `${stackName}-ServiceComponentTable`
export const IncidentTable = `${stackName}-IncidentTable`
export const IncidentUpdateTable = `${stackName}-IncidentUpdateTable`
export const MetricsTable = `${stackName}-MetricsTable`
export const MetricsDataTable = `${stackName}-MetricsDataTable`
export const MaintenanceTable = `${stackName}-MaintenanceTable`
export const MaintenanceUpdateTable = `${stackName}-MaintenanceUpdateTable`
export const SettingsTable = `${stackName}-SettingsTable`

export const componentStatuses = ['Operational', 'Under Maintenance', 'Degraded Performance', 'Partial Outage',
  'Major Outage']
export const incidentStatuses = ['Automated Alarm', 'Investigating', 'Identified', 'Monitoring', 'Resolved']
export const maintenanceStatuses = ['Scheduled', 'In Progress', 'Verifying', 'Completed']
export const metricStatusVisible = 'Visible'
export const metricStatusHidden = 'Hidden'
export const metricStatuses = [metricStatusVisible, metricStatusHidden]

export const region = process.env.AWS_DEFAULT_REGION
