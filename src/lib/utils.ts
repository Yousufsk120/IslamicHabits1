import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getIslamicGreeting(): string {
  const greetings = [
    "As-salamu alaikum",
    "Barakallahu feek",
    "May Allah bless you",
    "Jazakallahu khair"
  ]
  return greetings[Math.floor(Math.random() * greetings.length)]
}