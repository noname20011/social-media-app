import sanityClient from '@sanity/client'
import imageBuilderUrl from '@sanity/image-url'

export const client = sanityClient({
    projectId: '2ygued5k',
    dataset: 'production',
    apiVersion: '2022-04-16',
    useCdn: true,
    token: 'skMlx5xcE5OfWgjVybRbo5FLGPat2DRPtjguvWZwnhmcMhaS3DiMN8gJQigwhWeXulmpKgbKRpIc8RNpi1mSr1BECkb5Wm2CvVfaSc4Fs0GuLw6NhAnYFawyeLaCO6LS5R8C2U8sVZt3hDJxKLvbRzRUWAQcB04vmxrMmfx79iz11KKrIYTT'
})

const builder = imageBuilderUrl(client)

export const urlFor = (source) => builder.image(source)