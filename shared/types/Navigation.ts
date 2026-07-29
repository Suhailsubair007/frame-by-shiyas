export interface NAV_ITEM {
  readonly label: string
  readonly path: string
  readonly index: string
  readonly isExternal?: boolean
}

export interface NAV_SOCIAL {
  readonly label: string
  readonly url: string
  readonly icon: string
}
