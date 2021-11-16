import '../styles/index.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Page from '../components/SegmentPageTracker'
import withDarkMode from 'next-dark-mode'

export function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      document.body.classList.remove('prevent-scroll')
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  const [favicon, setFavicon] = useState('/favicon_system.svg')

  useEffect(() => {
    const onChange = (event) => {
      setFavicon(`/favicon_${event.matches ? 'dark' : 'light'}.svg`)
    }
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    if (query.addEventListener) {
      query.addEventListener('change', onChange)
    }
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const path = window.location.hash
    if (path && path.includes('#')) {
      setTimeout(() => {
        const scrolled = document.documentElement.scrollTop !== 0
        if (scrolled) return

        const id = path.replace('#', '')
        const el = window.document.getElementById(id)
        if (!el) return

        const r = el.getBoundingClientRect()
        window.top.scroll({
          top: scrollY + r.top - 100, // 100 for page header height
          behavior: 'smooth'
        })
      }, 600)
    }
  }, [])

  return (
    <>
      <Head>
        <link rel='shortcut icon' href={favicon} sizes='any' type='image/svg+xml' />
        <link rel='preload' href='https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css' as='style' />
      </Head>
      <Page>
        <Component {...pageProps} />
      </Page>
    </>
  )
}

export default withDarkMode(App, { defaultMode: 'dark' })
