# FreightSnap - Future TODO

## High Priority

### Currency Conversion (Promised in Gumroad)
- [ ] Add currency detection from extracted data (already have basic detection)
- [ ] Integrate exchange rate API (e.g., exchangerate-api.com or frankfurter.app - free)
- [ ] Add "Convert to USD" button in DataTable header
- [ ] Convert EUR, GBP, GEL values to USD on demand
- [ ] Show original value + converted value in tooltip

### Monthly Usage Tracking (500/month Fair Use)
- [ ] Implement server-side usage tracking per license key
- [ ] Store usage in database (Supabase or simple JSON file)
- [ ] Reset counter monthly
- [ ] Show usage in navbar for Pro users ("150/500 this month")
- [ ] Block after 500 with friendly "contact us" message

## Medium Priority

### Better PDF Parsing
- [ ] Add GPT-4 Vision as fallback for complex PDFs
- [ ] Let users choose model (fast/cheap vs accurate/expensive)
- [ ] Implement file queue for rate limiting

### Enterprise Features
- [ ] Team licenses (multiple seats)
- [ ] Custom branding
- [ ] API access

## Low Priority / Nice to Have

- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] Bulk file upload progress bar
- [ ] Save extraction templates
