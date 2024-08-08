import React, { useState } from 'react'
import { subjectColor } from 'src/format/subjectColor'
import { getSubjectName } from 'src/format/subjectName'
import { getAllHomeworks, getAllPresence } from 'src/queries'

import Divider from 'cozy-ui/transpiled/react/Divider'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import Empty from 'cozy-ui/transpiled/react/Empty'
import CozyIcon from 'cozy-ui/transpiled/react/Icons/Cozy'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import Paper from 'cozy-ui/transpiled/react/Paper'
import { LinearProgress } from 'cozy-ui/transpiled/react/Progress'
import ListSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListSkeleton'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const makeStyle = isMobile => ({
  header: {
    display: 'flex',
    padding: '1.5rem 2rem',
    justifyContent: 'space-between'
  },
  titlebar: {
    maxwidth: '100%',
    flex: 2
  }
})

export const HomeworksView = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const style = makeStyle(isMobile)

  const [homeworks, setHomeworks] = useState([])

  const fetchHws = async () => {
    // fetch presence events
    return getAllHomeworks().then(data => {
      // group by date
      let newHws = data.reduce((acc, hw) => {
        // convert YYYYMMDDT000000Z to YYYY-MM-DDT00:00:00Z
        const nDate = hw.dueDate.replace(
          /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
          '$1-$2-$3T$4:$5:$6Z'
        )

        const date = new Date(nDate)
        const day = date.toISOString()
        if (acc.find(group => group.date === day)) {
          return acc.map(group => {
            if (group.date === day) {
              return {
                ...group,
                hws: [...group.hws, hw]
              }
            }
            return group
          })
        }

        return [
          ...acc,
          {
            date: date.toISOString(),
            hws: [hw]
          }
        ]
      }, [])

      console.log(newHws)

      // set current True on the closest date
      const today = new Date()
      newHws.sort((a, b) => {
        return (
          Math.abs(today - new Date(a.date)) -
          Math.abs(today - new Date(b.date))
        )
      })
      newHws[0].current = true

      // sort back by date
      newHws.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })

      return setHomeworks(newHws)
    })
  }

  React.useEffect(() => {
    fetchHws()
  }, [])

  // scroll to current date
  React.useEffect(() => {
    const current = document.querySelector('.current')
    if (current) {
      current.scrollIntoView()
    }
  }, [homeworks])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Paper
          square
          style={{
            padding: '16px',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h4" color="textPrimary">
            {t('Homeworks.title')}
          </Typography>
        </Paper>

        <Divider />

        <div
          style={{
            height: '100%',
            overflow: 'auto',
            overflowY: 'scroll'
          }}
        >
          {homeworks.map((day, i) => (
            <List key={i} className={day.current ? 'current' : ''}>
              <ListSubheader>
                <Typography variant="subtitle2" color="textSecondary">
                  {new Date(day.date).toLocaleDateString('default', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Typography>
              </ListSubheader>

              {day.hws.map((hw, j) => (
                <div key={j}>
                  <ListItem>
                    <ListItemIcon>
                      <Typography variant="h3" color="textPrimary">
                        {getSubjectName(hw.subject).emoji || '📚'}
                      </Typography>
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: subjectColor(hw.subject)
                            }}
                          />
                          <Typography variant="subtitle2" color="textSecondary">
                            {getSubjectName(hw.subject).pretty}
                          </Typography>
                        </div>
                      }
                      secondary={
                        <Typography variant="body1" color="textPrimary">
                          {hw.summary}
                        </Typography>
                      }
                    />
                  </ListItem>

                  {j < day.hws.length - 1 && (
                    <Divider component="li" variant="inset" />
                  )}
                </div>
              ))}
            </List>
          ))}
        </div>
      </div>
    </>
  )
}