export interface SITE_META {
  readonly title: string
  readonly description: string
  readonly ogImage?: string
  readonly ogTitle?: string
  readonly ogDescription?: string
  readonly noIndex?: boolean
}

export interface SITE_CONFIG {
  readonly name: string
  readonly tagline: string
  readonly owner: string
  readonly baseUrl: string
  readonly email: string
  readonly socials: {
    readonly instagram?: string
    readonly vimeo?: string
    readonly youtube?: string
  }
}
