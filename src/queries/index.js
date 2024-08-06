import doctypes from 'src/doctypes'

import CozyClient, { Q } from 'cozy-client'

const client = CozyClient.fromDOM({
  doctypes
})

export const getAllGrades = async () => {
  const data = await client.queryAll(Q('io.cozy.timeseries.grades'))

  return data
}
