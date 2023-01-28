import {expect} from 'chai'
// @ts-ignore
import request from 'supertest'
import {logUsers, resetDatabase, server} from '../init.js'

let userTokens: Array<string>

describe('Character', () => {

    before(async function () {
        this.timeout(100000)
        await resetDatabase()
        userTokens = await logUsers()
    })

    it('Should get character list - 0 items', async () => {
        const response = await request(server)
            .get('/api/character')
            .set({
                'Authorization': `Bearer ${userTokens[0]}`
            })
        expect(response.status).to.equal(200)
        expect(response.body).to.be.instanceof(Array).and.lengthOf(0)
    })
})