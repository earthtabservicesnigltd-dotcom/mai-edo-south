import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from 'date-fns'
import slugify from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (d: string) => format(new Date(d), 'MMMM d, yyyy')
export const formatAgo  = (d: string) => formatDistanceToNow(new Date(d), { addSuffix: true })
export const makeSlug   = (s: string) => slugify(s, { lower: true, strict: true, trim: true })
export const initials   = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
