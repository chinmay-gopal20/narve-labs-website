# Narve Labs — Services & Tools

## Overview

| Service | Account | Plan | Used For |
|---------|---------|------|----------|
| **GoDaddy** | Personal | Paid | Domain registrar — owns `narvelabs.com` |
| **GitHub** | Personal (chinmay-gopal20) | Free | Source code — [narve-labs-website](https://github.com/chinmay-gopal20/narve-labs-website) |
| **Vercel** | Personal | Free | Hosting & deployment |
| **Make.com** | narvelabs@gmail.com | Free | Automation — receives form submissions via webhook and triggers Airtable + email |
| **Airtable** | narvelabs@gmail.com | Free | CRM database — stores every lead with name, email, message, UTM data, status |
| **Resend** | narvelabs@gmail.com | Free (3,000 emails/month) | Email delivery — sends lead notification to `narvelabs@gmail.com` when form is submitted |
| **Gmail** | narvelabs@gmail.com | Free | Receives lead notification emails |

---

## How They Connect

```
Website Form
     ↓
Make Webhook (instant trigger)
     ↓
Airtable (saves lead record)
     ↓
Resend (sends notification email)
     ↓
Gmail (you receive it)
```

---

## Service Details

### GoDaddy
- **URL:** [dcc.godaddy.com](https://dcc.godaddy.com)
- **Purpose:** Domain registration and DNS management for `narvelabs.com`
- **Notes:** All DNS records (MX, TXT, CNAME) are managed here

### Make.com
- **URL:** [us2.make.com](https://us2.make.com)
- **Purpose:** Core automation platform
- **Scenario:** `Narve Labs — Lead Capture` (ID: 5384018)
- **Webhook URL:** `https://hook.us2.make.com/parh5almi34kkqosxs81u82hzcjmtm3u`
- **Trigger:** Instant — fires on every form submission
- **Notes:** Free plan allows 1,000 operations/month

### Airtable
- **URL:** [airtable.com](https://airtable.com)
- **Purpose:** Lead CRM database
- **Base:** `Narve Labs` (ID: `apppTKGe3vwW2pYpJ`)
- **Table:** `Leads` (ID: `tblwyvBiw0m4Y3JV5`)
- **Fields Captured:**

| Field | Type | Source |
|-------|------|--------|
| Name | Text | Form input |
| Email | Text | Form input |
| Message | Text | Form input |
| UTM Source | Text | URL parameter |
| UTM Medium | Text | URL parameter |
| UTM Campaign | Text | URL parameter |
| Referrer | Text | Browser referrer |
| Submitted At | Date | Timestamp |
| Status | Select | Hardcoded as `New` |

### Resend
- **URL:** [resend.com](https://resend.com)
- **Purpose:** Transactional email delivery
- **Verified Domain:** `narvelabs.com`
- **From Address:** `leads@narvelabs.com`
- **To Address:** `narvelabs@gmail.com`
- **Free Tier:** 3,000 emails/month, 100/day
- **Notes:** API key stored in Make.com connection (ID: 9399756)

### Gmail
- **Account:** `narvelabs@gmail.com`
- **Purpose:** Receives lead notification emails from Resend
- **Email Subject Format:** `New Lead: {name} — {utm_source}`

---

## Webhook Payload

The website form POSTs this JSON to the Make webhook:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "We need to automate our sales pipeline",
  "utm_source": "linkedin",
  "utm_medium": "social",
  "utm_campaign": "launch",
  "referrer": "google.com",
  "submitted_at": "2026-06-14T10:30:00Z"
}
```

---

## Pending Decisions

| Item | Options | Notes |
|------|---------|-------|
| Business email `hello@narvelabs.com` | Zoho Mail (Free) or Google Workspace ($6/mo) | Needed to send/receive from a branded address |

---

## Future Upgrades

- [ ] Set up `hello@narvelabs.com` business email
- [ ] Migrate Make email module from Resend to Gmail (once Google Workspace is active)
- [ ] Upgrade Airtable to add lead scoring or pipeline views
- [ ] Add Make scenario for lead follow-up automation

---

*Last updated: June 2026*