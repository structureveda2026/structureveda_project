Reusable UI → components/
Business functionality → features/
Page composition → pages/
Page wrappers → layouts/
Navigation → routes/
API communication → services/
Global state → store/ / feature slices
Reusable logic → hooks/
Generic helpers → utils/
Environment/config → config/

## Consultation API

The consultation form sends a `POST` request to `/consultations` using the
`VITE_API_URL` base URL. It sends `fullName`, `age`, `phone`, `email`,
`dateOfBirth`, `timeOfBirth`, and `message` as JSON.

If your backend uses another endpoint, add this to `.env` and restart Vite:

```env
VITE_CONSULTATION_ENDPOINT=/your-consultation-endpoint
```
