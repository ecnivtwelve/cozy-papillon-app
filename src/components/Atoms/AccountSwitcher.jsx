import React, { useRef, useState } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ActionsMenuWrapper from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuWrapper'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import People from 'cozy-ui/transpiled/react/Icons/People'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { useAccountContext } from '../Provider/AccountProvider'

export const AccountSwitcher = () => {
  const { currentAccount, setCurrentAccount, accountsList, setAccountsList } =
    useAccountContext()
  const [accountMenuShown, setAccountMenuShown] = useState(false)

  const translatedAccType = type => {
    switch (type) {
      case 'pronote':
        return 'Pronote'
      default:
        return type
    }
  }

  const btnRef = useRef(null)

  if (!accountsList || accountsList.length < 2) {
    return null
  }

  return (
    <div>
      <Button
        ref={btnRef}
        label={
          <Typography
            noWrap
            variant="subtitle"
            color="body1"
            style={{ fontWeight: 600 }}
          >
            {currentAccount ? currentAccount.name : ''}
          </Typography>
        }
        onClick={() => setAccountMenuShown(true)}
        startIcon={
          <div
            style={{
              marginLeft: '2px',
              marginRight: '2px'
            }}
          >
            <Icon icon={People} size="14px" />
          </div>
        }
        endIcon={
          <div
            style={{
              marginLeft: '2px',
              marginRight: '2px',
              opacity: 0.5
            }}
          >
            <Icon icon={BottomIcon} size="14px" />
          </div>
        }
        style={{
          maxWidth: '100%'
        }}
        variant="secondary"
        size="small"
      />

      <ActionsMenuWrapper
        open={accountMenuShown}
        anchorEl={btnRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        keepMounted
        onClose={() => setAccountMenuShown(false)}
      >
        {accountsList.map(account => (
          <ActionsMenuItem
            key={account._id}
            onClick={() => {
              setCurrentAccount(account)
              setAccountMenuShown(false)
            }}
            selected={currentAccount?._id === account._id}
          >
            <ListItemIcon>
              <Icon icon={People} />
            </ListItemIcon>
            <ListItemText
              primary={account.name}
              secondary={translatedAccType(account.account_type)}
            />
          </ActionsMenuItem>
        ))}
      </ActionsMenuWrapper>
    </div>
  )
}