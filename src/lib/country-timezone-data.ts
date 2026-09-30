// Country and Timezone reference dataset and helper functions
// Provides country-to-timezone mapping, clock offsets, and live time calculation.

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  primaryTimezone: string;
  timezones: string[];
  currency: string;
  aliases?: string[];
}

export interface TimezoneOption {
  id: string; // Standard IANA timezone string e.g. "Asia/Kolkata"
  city: string; // Primary city or cities
  country: string; // Country name
  countryCode: string; // Country code
  flag: string; // Emoji flag
  label: string; // Display label
  aliases?: string[];
}

export const COUNTRIES: CountryOption[] = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫", primaryTimezone: "Asia/Kabul", timezones: ["Asia/Kabul"], currency: "AFN" },
  { code: "AL", name: "Albania", flag: "🇦🇱", primaryTimezone: "Europe/Tirane", timezones: ["Europe/Tirane"], currency: "ALL" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿", primaryTimezone: "Africa/Algiers", timezones: ["Africa/Algiers"], currency: "DZD" },
  { code: "AS", name: "American Samoa", flag: "🇦🇸", primaryTimezone: "Pacific/Pago_Pago", timezones: ["Pacific/Pago_Pago"], currency: "USD" },
  { code: "AD", name: "Andorra", flag: "🇦🇩", primaryTimezone: "Europe/Andorra", timezones: ["Europe/Andorra"], currency: "EUR" },
  { code: "AO", name: "Angola", flag: "🇦🇴", primaryTimezone: "Africa/Luanda", timezones: ["Africa/Luanda"], currency: "AOA" },
  { code: "AI", name: "Anguilla", flag: "🇦🇮", primaryTimezone: "America/Anguilla", timezones: ["America/Anguilla"], currency: "XCD" },
  { code: "AG", name: "Antigua & Barbuda", flag: "🇦🇬", primaryTimezone: "America/Antigua", timezones: ["America/Antigua"], currency: "XCD" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", primaryTimezone: "America/Argentina/Buenos_Aires", timezones: ["America/Argentina/Buenos_Aires"], currency: "ARS" },
  { code: "AM", name: "Armenia", flag: "🇦🇲", primaryTimezone: "Asia/Yerevan", timezones: ["Asia/Yerevan"], currency: "AMD" },
  { code: "AW", name: "Aruba", flag: "🇦🇼", primaryTimezone: "America/Aruba", timezones: ["America/Aruba"], currency: "AWG" },
  { code: "AU", name: "Australia", flag: "🇦🇺", primaryTimezone: "Australia/Sydney", timezones: ["Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth", "Australia/Adelaide"], currency: "AUD", aliases: ["AUS"] },
  { code: "AT", name: "Austria", flag: "🇦🇹", primaryTimezone: "Europe/Vienna", timezones: ["Europe/Vienna"], currency: "EUR" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", primaryTimezone: "Asia/Baku", timezones: ["Asia/Baku"], currency: "AZN" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸", primaryTimezone: "America/Nassau", timezones: ["America/Nassau"], currency: "BSD" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", primaryTimezone: "Asia/Bahrain", timezones: ["Asia/Bahrain"], currency: "BHD" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", primaryTimezone: "Asia/Dhaka", timezones: ["Asia/Dhaka"], currency: "BDT" },
  { code: "BB", name: "Barbados", flag: "🇧🇧", primaryTimezone: "America/Barbados", timezones: ["America/Barbados"], currency: "BBD" },
  { code: "BY", name: "Belarus", flag: "🇧🇾", primaryTimezone: "Europe/Minsk", timezones: ["Europe/Minsk"], currency: "BYN" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", primaryTimezone: "Europe/Brussels", timezones: ["Europe/Brussels"], currency: "EUR" },
  { code: "BZ", name: "Belize", flag: "🇧🇿", primaryTimezone: "America/Belize", timezones: ["America/Belize"], currency: "BZD" },
  { code: "BJ", name: "Benin", flag: "🇧🇯", primaryTimezone: "Africa/Porto-Novo", timezones: ["Africa/Porto-Novo"], currency: "XOF" },
  { code: "BM", name: "Bermuda", flag: "🇧🇲", primaryTimezone: "America/Bermuda", timezones: ["America/Bermuda"], currency: "BMD" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹", primaryTimezone: "Asia/Thimphu", timezones: ["Asia/Thimphu"], currency: "BTN" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", primaryTimezone: "America/La_Paz", timezones: ["America/La_Paz"], currency: "BOB" },
  { code: "BA", name: "Bosnia & Herzegovina", flag: "🇧🇦", primaryTimezone: "Europe/Sarajevo", timezones: ["Europe/Sarajevo"], currency: "BAM" },
  { code: "BW", name: "Botswana", flag: "🇧🇼", primaryTimezone: "Africa/Gaborone", timezones: ["Africa/Gaborone"], currency: "BWP" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", primaryTimezone: "America/Sao_Paulo", timezones: ["America/Sao_Paulo"], currency: "BRL" },
  { code: "BN", name: "Brunei", flag: "🇧🇳", primaryTimezone: "Asia/Brunei", timezones: ["Asia/Brunei"], currency: "BND" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", primaryTimezone: "Europe/Sofia", timezones: ["Europe/Sofia"], currency: "BGN" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", primaryTimezone: "Africa/Ouagadougou", timezones: ["Africa/Ouagadougou"], currency: "XOF" },
  { code: "BI", name: "Burundi", flag: "🇧🇮", primaryTimezone: "Africa/Bujumbura", timezones: ["Africa/Bujumbura"], currency: "BIF" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", primaryTimezone: "Asia/Phnom_Penh", timezones: ["Asia/Phnom_Penh"], currency: "KHR" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲", primaryTimezone: "Africa/Douala", timezones: ["Africa/Douala"], currency: "XAF" },
  { code: "CA", name: "Canada", flag: "🇨🇦", primaryTimezone: "America/Toronto", timezones: ["America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg", "America/Halifax"], currency: "CAD", aliases: ["CAN"] },
  { code: "CL", name: "Chile", flag: "🇨🇱", primaryTimezone: "America/Santiago", timezones: ["America/Santiago"], currency: "CLP" },
  { code: "CN", name: "China", flag: "🇨🇳", primaryTimezone: "Asia/Shanghai", timezones: ["Asia/Shanghai"], currency: "CNY", aliases: ["PRC"] },
  { code: "CO", name: "Colombia", flag: "🇨🇴", primaryTimezone: "America/Bogota", timezones: ["America/Bogota"], currency: "COP" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", primaryTimezone: "America/Costa_Rica", timezones: ["America/Costa_Rica"], currency: "CRC" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", primaryTimezone: "Europe/Zagreb", timezones: ["Europe/Zagreb"], currency: "EUR" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", primaryTimezone: "America/Havana", timezones: ["America/Havana"], currency: "CUP" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", primaryTimezone: "Asia/Nicosia", timezones: ["Asia/Nicosia"], currency: "EUR" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", primaryTimezone: "Europe/Prague", timezones: ["Europe/Prague"], currency: "CZK" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", primaryTimezone: "Europe/Copenhagen", timezones: ["Europe/Copenhagen"], currency: "DKK" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", primaryTimezone: "America/Santo_Domingo", timezones: ["America/Santo_Domingo"], currency: "DOP" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", primaryTimezone: "America/Guayaquil", timezones: ["America/Guayaquil"], currency: "USD" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", primaryTimezone: "Africa/Cairo", timezones: ["Africa/Cairo"], currency: "EGP" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", primaryTimezone: "Europe/Tallinn", timezones: ["Europe/Tallinn"], currency: "EUR" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", primaryTimezone: "Africa/Addis_Ababa", timezones: ["Africa/Addis_Ababa"], currency: "ETB" },
  { code: "FI", name: "Finland", flag: "🇫🇮", primaryTimezone: "Europe/Helsinki", timezones: ["Europe/Helsinki"], currency: "EUR" },
  { code: "FR", name: "France", flag: "🇫🇷", primaryTimezone: "Europe/Paris", timezones: ["Europe/Paris"], currency: "EUR", aliases: ["FRA"] },
  { code: "GE", name: "Georgia", flag: "🇬🇪", primaryTimezone: "Asia/Tbilisi", timezones: ["Asia/Tbilisi"], currency: "GEL" },
  { code: "DE", name: "Germany", flag: "🇩🇪", primaryTimezone: "Europe/Berlin", timezones: ["Europe/Berlin"], currency: "EUR", aliases: ["Deutschland", "DEU"] },
  { code: "GH", name: "Ghana", flag: "🇬🇭", primaryTimezone: "Africa/Accra", timezones: ["Africa/Accra"], currency: "GHS" },
  { code: "GR", name: "Greece", flag: "🇬🇷", primaryTimezone: "Europe/Athens", timezones: ["Europe/Athens"], currency: "EUR" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", primaryTimezone: "Asia/Hong_Kong", timezones: ["Asia/Hong_Kong"], currency: "HKD" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", primaryTimezone: "Europe/Budapest", timezones: ["Europe/Budapest"], currency: "HUF" },
  { code: "IS", name: "Iceland", flag: "🇮🇸", primaryTimezone: "Atlantic/Reykjavik", timezones: ["Atlantic/Reykjavik"], currency: "ISK" },
  { code: "IN", name: "India", flag: "🇮🇳", primaryTimezone: "Asia/Kolkata", timezones: ["Asia/Kolkata"], currency: "INR", aliases: ["Bharat", "Hindustan", "IND"] },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", primaryTimezone: "Asia/Jakarta", timezones: ["Asia/Jakarta", "Asia/Makassar"], currency: "IDR" },
  { code: "IR", name: "Iran", flag: "🇮🇷", primaryTimezone: "Asia/Tehran", timezones: ["Asia/Tehran"], currency: "IRR" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶", primaryTimezone: "Asia/Baghdad", timezones: ["Asia/Baghdad"], currency: "IQD" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", primaryTimezone: "Europe/Dublin", timezones: ["Europe/Dublin"], currency: "EUR" },
  { code: "IL", name: "Israel", flag: "🇮🇱", primaryTimezone: "Asia/Jerusalem", timezones: ["Asia/Jerusalem"], currency: "ILS" },
  { code: "IT", name: "Italy", flag: "🇮🇹", primaryTimezone: "Europe/Rome", timezones: ["Europe/Rome"], currency: "EUR" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲", primaryTimezone: "America/Jamaica", timezones: ["America/Jamaica"], currency: "JMD" },
  { code: "JP", name: "Japan", flag: "🇯🇵", primaryTimezone: "Asia/Tokyo", timezones: ["Asia/Tokyo"], currency: "JPY", aliases: ["JPN"] },
  { code: "JO", name: "Jordan", flag: "🇯🇴", primaryTimezone: "Asia/Amman", timezones: ["Asia/Amman"], currency: "JOD" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", primaryTimezone: "Asia/Almaty", timezones: ["Asia/Almaty"], currency: "KZT" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", primaryTimezone: "Africa/Nairobi", timezones: ["Africa/Nairobi"], currency: "KES" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", primaryTimezone: "Asia/Kuwait", timezones: ["Asia/Kuwait"], currency: "KWD" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧", primaryTimezone: "Asia/Beirut", timezones: ["Asia/Beirut"], currency: "LBP" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", primaryTimezone: "Europe/Luxembourg", timezones: ["Europe/Luxembourg"], currency: "EUR" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", primaryTimezone: "Asia/Kuala_Lumpur", timezones: ["Asia/Kuala_Lumpur"], currency: "MYR" },
  { code: "MV", name: "Maldives", flag: "🇲🇻", primaryTimezone: "Indian/Maldives", timezones: ["Indian/Maldives"], currency: "MVR" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺", primaryTimezone: "Indian/Mauritius", timezones: ["Indian/Mauritius"], currency: "MUR" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", primaryTimezone: "America/Mexico_City", timezones: ["America/Mexico_City"], currency: "MXN" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", primaryTimezone: "Africa/Casablanca", timezones: ["Africa/Casablanca"], currency: "MAD" },
  { code: "NP", name: "Nepal", flag: "🇳🇵", primaryTimezone: "Asia/Kathmandu", timezones: ["Asia/Kathmandu"], currency: "NPR" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", primaryTimezone: "Europe/Amsterdam", timezones: ["Europe/Amsterdam"], currency: "EUR" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", primaryTimezone: "Pacific/Auckland", timezones: ["Pacific/Auckland"], currency: "NZD" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", primaryTimezone: "Africa/Lagos", timezones: ["Africa/Lagos"], currency: "NGN" },
  { code: "NO", name: "Norway", flag: "🇳🇴", primaryTimezone: "Europe/Oslo", timezones: ["Europe/Oslo"], currency: "NOK" },
  { code: "OM", name: "Oman", flag: "🇴🇲", primaryTimezone: "Asia/Muscat", timezones: ["Asia/Muscat"], currency: "OMR" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", primaryTimezone: "Asia/Karachi", timezones: ["Asia/Karachi"], currency: "PKR" },
  { code: "PA", name: "Panama", flag: "🇵🇦", primaryTimezone: "America/Panama", timezones: ["America/Panama"], currency: "PAB" },
  { code: "PE", name: "Peru", flag: "🇵🇪", primaryTimezone: "America/Lima", timezones: ["America/Lima"], currency: "PEN" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", primaryTimezone: "Asia/Manila", timezones: ["Asia/Manila"], currency: "PHP" },
  { code: "PL", name: "Poland", flag: "🇵🇱", primaryTimezone: "Europe/Warsaw", timezones: ["Europe/Warsaw"], currency: "PLN" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", primaryTimezone: "Europe/Lisbon", timezones: ["Europe/Lisbon"], currency: "EUR" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", primaryTimezone: "Asia/Qatar", timezones: ["Asia/Qatar"], currency: "QAR" },
  { code: "RO", name: "Romania", flag: "🇷🇴", primaryTimezone: "Europe/Bucharest", timezones: ["Europe/Bucharest"], currency: "RON" },
  { code: "RU", name: "Russia", flag: "🇷🇺", primaryTimezone: "Europe/Moscow", timezones: ["Europe/Moscow"], currency: "RUB" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", primaryTimezone: "Asia/Riyadh", timezones: ["Asia/Riyadh"], currency: "SAR", aliases: ["KSA"] },
  { code: "SG", name: "Singapore", flag: "🇸🇬", primaryTimezone: "Asia/Singapore", timezones: ["Asia/Singapore"], currency: "SGD" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", primaryTimezone: "Africa/Johannesburg", timezones: ["Africa/Johannesburg"], currency: "ZAR" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", primaryTimezone: "Asia/Seoul", timezones: ["Asia/Seoul"], currency: "KRW" },
  { code: "ES", name: "Spain", flag: "🇪🇸", primaryTimezone: "Europe/Madrid", timezones: ["Europe/Madrid"], currency: "EUR" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", primaryTimezone: "Asia/Colombo", timezones: ["Asia/Colombo"], currency: "LKR" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", primaryTimezone: "Europe/Stockholm", timezones: ["Europe/Stockholm"], currency: "SEK" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", primaryTimezone: "Europe/Zurich", timezones: ["Europe/Zurich"], currency: "CHF" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", primaryTimezone: "Asia/Taipei", timezones: ["Asia/Taipei"], currency: "TWD" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", primaryTimezone: "Asia/Bangkok", timezones: ["Asia/Bangkok"], currency: "THB" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", primaryTimezone: "Europe/Istanbul", timezones: ["Europe/Istanbul"], currency: "TRY" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", primaryTimezone: "Asia/Dubai", timezones: ["Asia/Dubai"], currency: "AED", aliases: ["UAE"] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", primaryTimezone: "Europe/London", timezones: ["Europe/London"], currency: "GBP", aliases: ["UK"] },
  { code: "US", name: "United States", flag: "🇺🇸", primaryTimezone: "America/New_York", timezones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu"], currency: "USD", aliases: ["USA", "US"] },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", primaryTimezone: "Asia/Ho_Chi_Minh", timezones: ["Asia/Ho_Chi_Minh"], currency: "VND" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", primaryTimezone: "Africa/Harare", timezones: ["Africa/Harare"], currency: "ZWL" },
];

export const TIMEZONES: TimezoneOption[] = [
  // India
  {
    id: "Asia/Kolkata",
    city: "New Delhi, Mumbai, Kolkata",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    label: "India Standard Time (IST)",
    aliases: ["IST", "India", "Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "+5:30", "5:30"],
  },
  // United States
  {
    id: "America/New_York",
    city: "New York, Washington D.C., Miami",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    label: "Eastern Time (ET / EST / EDT)",
    aliases: ["EST", "EDT", "ET", "New York", "Boston", "Atlanta", "USA", "-5", "-4"],
  },
  {
    id: "America/Chicago",
    city: "Chicago, Dallas, Houston",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    label: "Central Time (CT / CST / CDT)",
    aliases: ["CST", "CDT", "CT", "Chicago", "Dallas", "Houston", "-6", "-5"],
  },
  {
    id: "America/Denver",
    city: "Denver, Phoenix, Salt Lake City",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    label: "Mountain Time (MT / MST / MDT)",
    aliases: ["MST", "MDT", "MT", "Denver", "Phoenix", "-7", "-6"],
  },
  {
    id: "America/Los_Angeles",
    city: "Los Angeles, San Francisco, Seattle",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    label: "Pacific Time (PT / PST / PDT)",
    aliases: ["PST", "PDT", "PT", "San Francisco", "California", "Seattle", "-8", "-7"],
  },
  {
    id: "America/Anchorage",
    city: "Anchorage, Alaska",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    label: "Alaska Time (AKST / AKDT)",
    aliases: ["Alaska", "AKST", "-9", "-8"],
  },
  {
    id: "Pacific/Honolulu",
    city: "Honolulu, Hawaii",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    label: "Hawaii Time (HST)",
    aliases: ["Hawaii", "HST", "-10"],
  },
  // United Kingdom
  {
    id: "Europe/London",
    city: "London, Manchester, Edinburgh",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    label: "Greenwich Mean Time / BST",
    aliases: ["GMT", "BST", "London", "UK", "Britain", "+0", "+1"],
  },
  // UAE & Gulf
  {
    id: "Asia/Dubai",
    city: "Dubai, Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
    flag: "🇦🇪",
    label: "Gulf Standard Time (GST)",
    aliases: ["GST", "Dubai", "UAE", "Abu Dhabi", "+4"],
  },
  {
    id: "Asia/Riyadh",
    city: "Riyadh, Jeddah",
    country: "Saudi Arabia",
    countryCode: "SA",
    flag: "🇸🇦",
    label: "Arabia Standard Time (AST)",
    aliases: ["AST", "Saudi", "Riyadh", "+3"],
  },
  {
    id: "Asia/Qatar",
    city: "Doha",
    country: "Qatar",
    countryCode: "QA",
    flag: "🇶🇦",
    label: "Qatar Time (AST)",
    aliases: ["Qatar", "Doha", "+3"],
  },
  {
    id: "Asia/Kuwait",
    city: "Kuwait City",
    country: "Kuwait",
    countryCode: "KW",
    flag: "🇰🇼",
    label: "Kuwait Time (AST)",
    aliases: ["Kuwait", "+3"],
  },
  {
    id: "Asia/Muscat",
    city: "Muscat",
    country: "Oman",
    countryCode: "OM",
    flag: "🇴🇲",
    label: "Oman Time (GST)",
    aliases: ["Oman", "Muscat", "+4"],
  },
  {
    id: "Asia/Bahrain",
    city: "Manama",
    country: "Bahrain",
    countryCode: "BH",
    flag: "🇧🇭",
    label: "Bahrain Time (AST)",
    aliases: ["Bahrain", "+3"],
  },
  // Singapore & East Asia
  {
    id: "Asia/Singapore",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    label: "Singapore Standard Time (SGT)",
    aliases: ["SGT", "Singapore", "+8"],
  },
  {
    id: "Asia/Tokyo",
    city: "Tokyo, Osaka",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    label: "Japan Standard Time (JST)",
    aliases: ["JST", "Tokyo", "Japan", "+9"],
  },
  {
    id: "Asia/Shanghai",
    city: "Beijing, Shanghai, Shenzhen",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    label: "China Standard Time (CST)",
    aliases: ["CST", "China", "Beijing", "Shanghai", "+8"],
  },
  {
    id: "Asia/Hong_Kong",
    city: "Hong Kong",
    country: "Hong Kong",
    countryCode: "HK",
    flag: "🇭🇰",
    label: "Hong Kong Time (HKT)",
    aliases: ["HKT", "Hong Kong", "+8"],
  },
  {
    id: "Asia/Seoul",
    city: "Seoul",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    label: "Korea Standard Time (KST)",
    aliases: ["KST", "Seoul", "Korea", "+9"],
  },
  // Australia & New Zealand
  {
    id: "Australia/Sydney",
    city: "Sydney, Canberra",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    label: "Australian Eastern Time (AEST / AEDT)",
    aliases: ["AEST", "AEDT", "Sydney", "Australia", "+10", "+11"],
  },
  {
    id: "Australia/Melbourne",
    city: "Melbourne",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    label: "Australian Eastern Time (Melbourne)",
    aliases: ["Melbourne", "+10", "+11"],
  },
  {
    id: "Australia/Brisbane",
    city: "Brisbane, Queensland",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    label: "Australian Eastern Standard Time (no DST)",
    aliases: ["Brisbane", "+10"],
  },
  {
    id: "Australia/Adelaide",
    city: "Adelaide",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    label: "Australian Central Time (ACST / ACDT)",
    aliases: ["Adelaide", "+9:30", "+10:30"],
  },
  {
    id: "Australia/Perth",
    city: "Perth, Western Australia",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    label: "Australian Western Standard Time (AWST)",
    aliases: ["Perth", "AWST", "+8"],
  },
  {
    id: "Pacific/Auckland",
    city: "Auckland, Wellington",
    country: "New Zealand",
    countryCode: "NZ",
    flag: "🇳🇿",
    label: "New Zealand Time (NZST / NZDT)",
    aliases: ["NZST", "NZDT", "Auckland", "New Zealand", "+12", "+13"],
  },
  // Canada
  {
    id: "America/Toronto",
    city: "Toronto, Ottawa, Montreal",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    label: "Eastern Time (Canada)",
    aliases: ["Toronto", "Montreal", "Canada", "-5", "-4"],
  },
  {
    id: "America/Vancouver",
    city: "Vancouver, Victoria",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    label: "Pacific Time (Canada)",
    aliases: ["Vancouver", "BC", "-8", "-7"],
  },
  {
    id: "America/Edmonton",
    city: "Calgary, Edmonton",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    label: "Mountain Time (Canada)",
    aliases: ["Calgary", "Edmonton", "Alberta", "-7", "-6"],
  },
  // Europe
  {
    id: "Europe/Berlin",
    city: "Berlin, Frankfurt, Munich",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    label: "Central European Time (CET / CEST)",
    aliases: ["CET", "CEST", "Berlin", "Germany", "Frankfurt", "+1", "+2"],
  },
  {
    id: "Europe/Paris",
    city: "Paris, Lyon, Marseille",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    label: "Central European Time (Paris)",
    aliases: ["Paris", "France", "+1", "+2"],
  },
  {
    id: "Europe/Amsterdam",
    city: "Amsterdam, Rotterdam",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    label: "Central European Time (Amsterdam)",
    aliases: ["Amsterdam", "Netherlands", "Holland", "+1", "+2"],
  },
  {
    id: "Europe/Zurich",
    city: "Zurich, Geneva",
    country: "Switzerland",
    countryCode: "CH",
    flag: "🇨🇭",
    label: "Central European Time (Zurich)",
    aliases: ["Zurich", "Geneva", "Switzerland", "+1", "+2"],
  },
  {
    id: "Europe/Madrid",
    city: "Madrid, Barcelona",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    label: "Central European Time (Madrid)",
    aliases: ["Madrid", "Barcelona", "Spain", "+1", "+2"],
  },
  {
    id: "Europe/Rome",
    city: "Rome, Milan",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    label: "Central European Time (Rome)",
    aliases: ["Rome", "Milan", "Italy", "+1", "+2"],
  },
  {
    id: "Europe/Stockholm",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
    label: "Central European Time (Stockholm)",
    aliases: ["Stockholm", "Sweden", "+1", "+2"],
  },
  {
    id: "Europe/Dublin",
    city: "Dublin",
    country: "Ireland",
    countryCode: "IE",
    flag: "🇮🇪",
    label: "Irish Standard Time / GMT",
    aliases: ["Dublin", "Ireland", "+0", "+1"],
  },
  {
    id: "Europe/Istanbul",
    city: "Istanbul, Ankara",
    country: "Turkey",
    countryCode: "TR",
    flag: "🇹🇷",
    label: "Turkey Time (TRT)",
    aliases: ["Istanbul", "Turkey", "TRT", "+3"],
  },
  {
    id: "Europe/Moscow",
    city: "Moscow, St. Petersburg",
    country: "Russia",
    countryCode: "RU",
    flag: "🇷🇺",
    label: "Moscow Standard Time (MSK)",
    aliases: ["Moscow", "MSK", "Russia", "+3"],
  },
  // South Asia & Southeast Asia
  {
    id: "Asia/Karachi",
    city: "Karachi, Islamabad, Lahore",
    country: "Pakistan",
    countryCode: "PK",
    flag: "🇵🇰",
    label: "Pakistan Standard Time (PKT)",
    aliases: ["PKT", "Pakistan", "Karachi", "Islamabad", "+5"],
  },
  {
    id: "Asia/Dhaka",
    city: "Dhaka, Chittagong",
    country: "Bangladesh",
    countryCode: "BD",
    flag: "🇧🇩",
    label: "Bangladesh Standard Time (BST)",
    aliases: ["BST", "Bangladesh", "Dhaka", "+6"],
  },
  {
    id: "Asia/Colombo",
    city: "Colombo",
    country: "Sri Lanka",
    countryCode: "LK",
    flag: "🇱🇰",
    label: "Sri Lanka Standard Time (SLST)",
    aliases: ["Colombo", "Sri Lanka", "+5:30"],
  },
  {
    id: "Asia/Kathmandu",
    city: "Kathmandu",
    country: "Nepal",
    countryCode: "NP",
    flag: "🇳🇵",
    label: "Nepal Time (NPT)",
    aliases: ["Kathmandu", "Nepal", "+5:45"],
  },
  {
    id: "Asia/Kuala_Lumpur",
    city: "Kuala Lumpur",
    country: "Malaysia",
    countryCode: "MY",
    flag: "🇲🇾",
    label: "Malaysia Time (MYT)",
    aliases: ["Kuala Lumpur", "Malaysia", "MYT", "+8"],
  },
  {
    id: "Asia/Jakarta",
    city: "Jakarta, Surabaya",
    country: "Indonesia",
    countryCode: "ID",
    flag: "🇮🇩",
    label: "Western Indonesia Time (WIB)",
    aliases: ["Jakarta", "Indonesia", "WIB", "+7"],
  },
  {
    id: "Asia/Bangkok",
    city: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    flag: "🇹🇭",
    label: "Indochina Time (ICT)",
    aliases: ["Bangkok", "Thailand", "ICT", "+7"],
  },
  {
    id: "Asia/Ho_Chi_Minh",
    city: "Ho Chi Minh City, Hanoi",
    country: "Vietnam",
    countryCode: "VN",
    flag: "🇻🇳",
    label: "Indochina Time (Vietnam)",
    aliases: ["Vietnam", "Saigon", "Hanoi", "+7"],
  },
  {
    id: "Asia/Manila",
    city: "Manila",
    country: "Philippines",
    countryCode: "PH",
    flag: "🇵🇭",
    label: "Philippine Standard Time (PST)",
    aliases: ["Manila", "Philippines", "+8"],
  },
  // Africa
  {
    id: "Africa/Johannesburg",
    city: "Johannesburg, Cape Town",
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    label: "South Africa Standard Time (SAST)",
    aliases: ["Johannesburg", "Cape Town", "South Africa", "+2"],
  },
  {
    id: "Africa/Cairo",
    city: "Cairo, Alexandria",
    country: "Egypt",
    countryCode: "EG",
    flag: "🇪🇬",
    label: "Eastern European Time (Cairo)",
    aliases: ["Cairo", "Egypt", "+2", "+3"],
  },
  {
    id: "Africa/Lagos",
    city: "Lagos, Abuja",
    country: "Nigeria",
    countryCode: "NG",
    flag: "🇳🇬",
    label: "West Africa Time (WAT)",
    aliases: ["Lagos", "Nigeria", "WAT", "+1"],
  },
  {
    id: "Africa/Nairobi",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    flag: "🇰🇪",
    label: "East Africa Time (EAT)",
    aliases: ["Nairobi", "Kenya", "EAT", "+3"],
  },
  // Latin America
  {
    id: "America/Sao_Paulo",
    city: "São Paulo, Rio de Janeiro",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    label: "Brasília Time (BRT)",
    aliases: ["Sao Paulo", "Brazil", "BRT", "-3"],
  },
  {
    id: "America/Mexico_City",
    city: "Mexico City, Guadalajara",
    country: "Mexico",
    countryCode: "MX",
    flag: "🇲🇽",
    label: "Central Time (Mexico)",
    aliases: ["Mexico City", "Mexico", "-6"],
  },
  // UTC
  {
    id: "UTC",
    city: "Universal Time Coordinated",
    country: "Global",
    countryCode: "UN",
    flag: "🌐",
    label: "Coordinated Universal Time (UTC)",
    aliases: ["UTC", "GMT", "Universal", "+0", "0"],
  },
];

/**
 * Calculates current live time and UTC offset for any IANA timezone.
 */
export function getTimezoneLiveInfo(timeZone: string) {
  try {
    const now = new Date();
    const shortTimeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const currentTime = shortTimeFormatter.format(now);

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    }).formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || "";

    let offset = "UTC+00:00";
    const match = tzPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (match) {
      const sign = match[1];
      const hours = match[2].padStart(2, "0");
      const mins = (match[3] || "00").padStart(2, "0");
      offset = `UTC${sign}${hours}:${mins}`;
    } else if (tzPart.includes("GMT")) {
      offset = "UTC+00:00";
    }

    return {
      offset,
      currentTime,
    };
  } catch {
    return {
      offset: "UTC+00:00",
      currentTime: "--:--",
    };
  }
}

/**
 * Normalizes any timezone string to a clean IANA timezone ID.
 * Handles strings like "Asia/Kolkata (IST - UTC+05:30)", "Asia/Kolkata", "UTC", etc.
 */
export function normalizeTimezoneId(val?: string): string {
  if (!val) return "Asia/Kolkata";
  const trimmed = val.trim();
  // If format is "Asia/Kolkata (...)"
  const firstPart = trimmed.split(" ")[0].trim();
  if (TIMEZONES.some((t) => t.id.toLowerCase() === firstPart.toLowerCase())) {
    const matched = TIMEZONES.find((t) => t.id.toLowerCase() === firstPart.toLowerCase());
    return matched?.id || firstPart;
  }
  // Check exact ID match
  const exact = TIMEZONES.find((t) => t.id.toLowerCase() === trimmed.toLowerCase());
  if (exact) return exact.id;

  // Check aliases or label
  const byAlias = TIMEZONES.find(
    (t) =>
      t.label.toLowerCase().includes(trimmed.toLowerCase()) ||
      t.aliases?.some((a) => a.toLowerCase() === trimmed.toLowerCase())
  );
  if (byAlias) return byAlias.id;

  return firstPart || "Asia/Kolkata";
}

/**
 * Finds a matching CountryOption based on country name, code, or alias.
 */
export function findMatchingCountry(countryQuery?: string): CountryOption | undefined {
  if (!countryQuery) return undefined;
  const q = countryQuery.trim().toLowerCase();
  return COUNTRIES.find(
    (c) =>
      c.name.toLowerCase() === q ||
      c.code.toLowerCase() === q ||
      c.aliases?.some((a) => a.toLowerCase() === q) ||
      q.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(q)
  );
}

/**
 * Finds a timezone record by query (ID, city, country, or offset).
 */
export function findTimezoneRecord(tzQuery?: string): TimezoneOption | undefined {
  if (!tzQuery) return undefined;
  const normId = normalizeTimezoneId(tzQuery);
  const byId = TIMEZONES.find((t) => t.id.toLowerCase() === normId.toLowerCase());
  if (byId) return byId;

  const q = tzQuery.trim().toLowerCase();
  return TIMEZONES.find(
    (t) =>
      t.id.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q) ||
      t.country.toLowerCase().includes(q) ||
      t.aliases?.some((a) => a.toLowerCase().includes(q))
  );
}

/**
 * Returns default primary timezone for a country name or code.
 */
export function getDefaultTimezoneForCountry(countryNameOrCode?: string): TimezoneOption {
  const country = findMatchingCountry(countryNameOrCode);
  if (country) {
    const tz = TIMEZONES.find((t) => t.id === country.primaryTimezone);
    if (tz) return tz;
  }
  // Default to India (Asia/Kolkata) or UTC
  return TIMEZONES[0];
}

/**
 * Returns all timezones belonging to a country.
 */
export function getTimezonesForCountry(countryNameOrCode?: string): TimezoneOption[] {
  const country = findMatchingCountry(countryNameOrCode);
  if (!country) return [];
  return TIMEZONES.filter((t) => country.timezones.includes(t.id));
}
