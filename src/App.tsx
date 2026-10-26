import { useServiceStatus } from './hooks/useServiceStatus'
import styles from './App.module.css'

export default function App() {
  const { availability, retry } = useServiceStatus()

  const copy = {
    loading: { title: 'Checking connection', detail: 'Making sure everything is ready.' },
    ready: { title: 'Connected and ready', detail: 'The Quoriva foundation is running.' },
    unavailable: {
      title: 'Temporarily unavailable',
      detail: 'We couldn’t connect right now. Give it a moment, then try again.',
    },
  }[availability]

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label="Quoriva home">
          <span className={styles.mark} aria-hidden="true">Q</span>
          Quoriva
        </a>
        <span className={styles.phase}>First steps · QV-001</span>
      </header>

      <section className={styles.intro} aria-labelledby="page-title">
        <p className={styles.eyebrow}>A place for what’s next</p>
        <h1 id="page-title">Every great event<br />starts somewhere.</h1>
        <p className={styles.description}>
          We’re laying the groundwork for discovering events, choosing your seat,
          and being part of the moment.
        </p>
      </section>

      <section className={styles.card} aria-labelledby="connection-title" aria-busy={availability === 'loading'}>
        <div className={styles.cardHeader}>
          <p className={styles.eyebrow}>Foundation status</p>
          <span className={`${styles.indicator} ${styles[availability]}`} aria-hidden="true" />
        </div>
        <div role="status" aria-live="polite" aria-atomic="true">
          <h2 id="connection-title">{copy.title}</h2>
          <p className={styles.detail}>{copy.detail}</p>
        </div>
        <button className={styles.button} onClick={retry} disabled={availability === 'loading'}>
          {availability === 'loading' ? 'Checking…' : availability === 'ready' ? 'Check again' : 'Try again'}
          <span aria-hidden="true">↗</span>
        </button>
      </section>

      <footer className={styles.footer}>
        <span>Built one step at a time.</span>
        <span>Events &amp; reservations</span>
      </footer>
    </main>
  )
}
