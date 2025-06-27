export interface Newspiece {
  title: string
  intro_text: string
  intro_audio: string
  owner: string
  owner_username: string | null
  owner_stripe_account_id: string | null
  genre: string | null
  date_created: string
  newspiece: string
  name: string
  image: string
  intro: string
  restricted: boolean
  gradient_primary: string
  gradient_secondary: string
  timestamping: Array<{
    start: number
    end: number
    text: string
  }>
  waveformData: any[]
  access: string
  visibility: string
  visibility_users: string[]
  access_users: string[]
  last_post_date: string
  premium: boolean
  subscription_price: number | null
  price_id: string | null
  owner_name: string
  image_urls: {
    thumbnail: string | null
    medium: string | null
    large: string | null
    original: string | null
  }
}
