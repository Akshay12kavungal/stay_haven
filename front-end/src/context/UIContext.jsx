import { Alert, Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import AuthDialog from '../components/dialogs/AuthDialog';
import ContactDialog from '../components/dialogs/ContactDialog';
import ListPropertyDialog from '../components/dialogs/ListPropertyDialog';
import PolicyDialog from '../components/dialogs/PolicyDialog';

const UIContext = createContext(null);

// Site-wide dialogs and toasts, so any component can open them without prop drilling.
export function UIProvider({ children }) {
  const [dialog, setDialog] = useState(null); // { name, props }
  const [toast, setToast] = useState(null);

  const close = useCallback(() => setDialog(null), []);
  const notify = useCallback((message, severity = 'success') => setToast({ message, severity, key: Date.now() }), []);

  const value = useMemo(() => ({
    openAuth: (mode = 'login', onSuccess) => setDialog({ name: 'auth', props: { mode, onSuccess } }),
    openContact: () => setDialog({ name: 'contact' }),
    openListProperty: () => setDialog({ name: 'listProperty' }),
    openPolicy: () => setDialog({ name: 'policy' }),
    closeDialog: close,
    notify,
  }), [close, notify]);

  return (
    <UIContext.Provider value={value}>
      {children}
      <AuthDialog open={dialog?.name === 'auth'} onClose={close} {...dialog?.props} />
      <ContactDialog open={dialog?.name === 'contact'} onClose={close} />
      <ListPropertyDialog open={dialog?.name === 'listProperty'} onClose={close} />
      <PolicyDialog open={dialog?.name === 'policy'} onClose={close} />
      <Snackbar
        key={toast?.key}
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert onClose={() => setToast(null)} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
