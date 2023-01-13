// Code generated by generate-maintenance-handler. DO NOT EDIT.
/* eslint-disable */
import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getMaintenance'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { Maintenance, MaintenanceUpdate } from 'model/maintenances'
import { NotFoundError } from 'utils/errors'

describe('getMaintenance', () => {
  afterEach(() => {
    MaintenancesStore.prototype.get.restore()
    MaintenanceUpdatesStore.prototype.query.restore()
  })

  it('should return an maintenance', async () => {
    const maintenance = new Maintenance({maintenanceID: '1'})
    sinon.stub(MaintenancesStore.prototype, 'get').returns(maintenance)
    const maintenanceUpdates = [new MaintenanceUpdate({maintenanceID: '1', maintenanceUpdateID: '1'})]
    sinon.stub(MaintenanceUpdatesStore.prototype, 'query').returns(maintenanceUpdates)

    return await handle({ params: { maintenanceid: '1' } }, null, (error, result) => {
      assert(error === null)
      assert(result.maintenanceID === '1')
      assert(result.maintenanceUpdates.length === 1)
      assert(result.maintenanceUpdates[0].maintenanceID === '1')
      assert(result.maintenanceUpdates[0].maintenanceUpdateID === '1')
    })
  })

  it('should handle not found error', async () => {
    sinon.stub(MaintenancesStore.prototype, 'get').throws(new NotFoundError())
    sinon.stub(MaintenanceUpdatesStore.prototype, 'query').throws()
    return await handle({ params: { maintenanceid: '1' } }, null, (error, result) => {
      assert(error.match(/not found/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(MaintenancesStore.prototype, 'get').throws()
    sinon.stub(MaintenanceUpdatesStore.prototype, 'query').throws()
    return await handle({ params: { maintenanceid: '1' } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
