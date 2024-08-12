import CozyClient, { Q } from 'cozy-client'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000 // 10 minutes
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const buildTimetableQuery = (start, end) => ({
  definition: () =>
    Q('io.cozy.calendar.event')
      .where({
        _id: { $gt: null },
        start: start ? { $gte: start } : { $gt: null },
        end: end ? { $lte: end } : { $lt: null }
      })
      .indexFields(['start', 'end', '_id']),
  options: {
    as: 'io.cozy.calendar.event/start/' + start + '/end/' + end,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildTimetableItemQuery = id => ({
  definition: () => Q('io.cozy.calendar.event').getById(id),
  options: {
    as: 'io.cozy.calendar.event/' + id,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildHomeworkQuery = () => ({
  definition: () =>
    Q('io.cozy.calendar.todos')
      .where({
        _id: { $gt: null }
      })
      .sortBy([{ dueDate: 'desc' }, { _id: 'desc' }])
      .indexFields(['dueDate', '_id']),
  options: {
    as: 'io.cozy.calendar.todos',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildGradesQuery = period => ({
  definition: () =>
    Q('io.cozy.timeseries.grades')
      .where({
        title: period || { $gt: null }
      })
      .indexFields(['title']),
  options: {
    as: 'io.cozy.timeseries.grades',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildGradeItemQuery = id => ({
  definition: () => Q('io.cozy.timeseries.grades').getById(id),
  options: {
    as: 'io.cozy.timeseries.grades/' + id,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildPresenceQuery = () => ({
  definition: () =>
    Q('io.cozy.calendar.presence')
      .where({
        _id: { $gt: null }
      })
      .sortBy([{ start: 'desc' }, { _id: 'desc' }])
      .indexFields(['start', '_id']),
  options: {
    as: 'io.cozy.calendar.presence',
    fetchPolicy: defaultFetchPolicy
  }
})
