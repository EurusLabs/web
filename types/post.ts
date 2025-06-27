export interface Post {
  id: string
  title: string
  date_created: string
  owner: string
  owner_username: string
  owner_image: string | null
  name: string
  tags: string[]
  citations: number
  content_text: string
  content_audio_url: string
  posts_cited: string[]
  posts_cited_details: any[]
  timestamping: Array<{
    start: number
    end: number
    text: string
  }>
  newspiece_id: string
  soundscape: string | null
  likes: number
  access: string | null
  visibility: string | null
  streams: number
  genre: string | null
  duration: number
  visibility_users: string[]
  access_users: string[]
}
