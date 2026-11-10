import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, CircleHelp, Instagram, Leaf, LockKeyhole, Menu, Minus, Plus, ShoppingBag, Sparkles, X } from 'lucide-react'
import { brand, formulas, fragrances, prices, quizQuestions, type Formula, type QuizQuestion } from './data/config'
import { getMatchReason, scoreFormulas } from './lib/matching'
import { defaultBottle, loadState, saveState, type BottleConfig, type ChikuState } from './lib/storage'

const money = (amount: number) => `₹${amount.toLocaleString('en-IN')}`
const pageMotion = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.32 } }

function Logo({ light = false }: { light?: boolean }) {
  return <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label="Chiku home">chiku<span className="logo-fruit" aria-hidden="true" /></Link>
}

function Bottle({ formula, bottle = defaultBottle, size = 'large' }: { formula: Formula; bottle?: BottleConfig; size?: 'large' | 'small' }) {
  const scale = bottle.size === '50 ml' ? 0.84 : bottle.size === '400 ml' ? 1.08 : 1
  return (
    <div className={`bottle-wrap bottle-${size}`} style={{ transform: `scale(${scale})` }}>
      <svg viewBox="0 0 250 410" role="img" aria-label={`${formula.name} Chiku shampoo bottle`}>
        <ellipse cx="125" cy="391" rx="82" ry="12" fill="#6c4a31" opacity=".12" />
        <rect x="95" y="13" width="60" height="36" rx="9" fill="#493225" />
        <rect x="106" y="0" width="38" height="19" rx="6" fill="#30231e" />
        <path d="M75 48h100c8 0 14 6 14 14v20c0 12 22 17 22 40v218c0 24-17 42-41 42H80c-24 0-41-18-41-42V122c0-23 22-28 22-40V62c0-8 6-14 14-14Z" fill={bottle.color} stroke="#67492f" strokeOpacity=".2" strokeWidth="2" />
        <path d="M63 139c30-13 94-13 124 0v193c0 19-12 30-29 30H92c-17 0-29-11-29-30V139Z" fill={formula.color} opacity=".45" />
        <path d="M65 136c29-12 91-12 120 0" fill="none" stroke="#fff9ef" strokeWidth="2" opacity=".7" />
        <rect x="60" y="148" width="130" height="127" rx="12" fill="#fbf8f1" opacity=".96" />
        <text x="125" y="172" textAnchor="middle" fill="#432f25" fontFamily="Fraunces, Georgia, serif" fontSize="18">chiku</text>
        <circle cx="151" cy="165" r="2.8" fill="#c99557" />
        <text x="125" y="207" textAnchor="middle" fill="#49362b" fontFamily="DM Sans, sans-serif" fontSize="8" letterSpacing="2">YOUR SHAMPOO, YOUR RULES</text>
        <text x="125" y="231" textAnchor="middle" fill="#34251f" fontFamily="Fraunces, Georgia, serif" fontSize="17">{formula.name}</text>
        <text x="125" y="249" textAnchor="middle" fill="#755e4a" fontFamily="DM Sans, sans-serif" fontSize="9">{bottle.name.trim() || 'made for you'}</text>
        <line x1="88" y1="258" x2="162" y2="258" stroke="#cdb89e" />
        <text x="125" y="269" textAnchor="middle" fill="#755e4a" fontFamily="DM Sans, sans-serif" fontSize="7">{bottle.size.toUpperCase()} · {bottle.fragrance.toUpperCase()}</text>
        <path d="M71 83c-9 13-16 20-16 36v235c0 16 6 28 15 35" fill="none" stroke="#fff" strokeWidth="5" opacity=".3" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function FormulaCard({ formula, index = 0, compact = false }: { formula: Formula; index?: number; compact?: boolean }) {
  return (
    <motion.article className={`formula-card ${compact ? 'formula-card-compact' : ''}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .06, duration: .45 }}>
      <div className="formula-swatch" style={{ background: formula.color }}>
        <span className="formula-number">NO. {formula.id}</span>
        <span className="swatch-orbit orbit-one" /><span className="swatch-orbit orbit-two" />
        <span className="swatch-dot" />
        <span className="formula-tag">{formula.concern}</span>
      </div>
      <div className="formula-card-copy">
        <h3>{formula.name}</h3>
        <p className="formula-for">{formula.forWho}</p>
        {!compact && <p className="muted">{formula.description}</p>}
      </div>
    </motion.article>
  )
}

function Header({ state }: { state: ChikuState }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0)
  const close = () => setMenuOpen(false)
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Logo />
        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/formulas" onClick={close}>Formulas</NavLink>
          <NavLink to="/story" onClick={close}>How it works</NavLink>
          <Link to="/quiz" className="mobile-quiz" onClick={close}>Take the quiz</Link>
          <NavLink to="/account" onClick={close}>My Chiku</NavLink>
          <NavLink to="/auth" onClick={close}>{state.user ? 'Account' : 'Log in'}</NavLink>
        </nav>
        <div className="nav-actions">
          <Link to="/quiz" className="button button-small button-dark nav-quiz">Take the quiz <ArrowRight size={15} /></Link>
          <Link to="/cart" className="cart-link" aria-label={`Cart with ${count} items`}><ShoppingBag size={19} /><span className="cart-count">{count}</span></Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent) => { event.preventDefault(); if (email.includes('@')) setSubmitted(true) }
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><Logo light /><p>{brand.footerLine}</p><a className="social-link" href="https://instagram.com" aria-label="Instagram"><Instagram size={18} /></a></div>
        <div className="footer-links"><span className="eyebrow">Take a look</span><Link to="/formulas">The formulas</Link><Link to="/story">Our story</Link><Link to="/quiz">Find your formula</Link><Link to="/account">My Chiku</Link></div>
        <div className="footer-signup"><span className="eyebrow">A good hair note, now and then</span><p>No spam. We have better things to do.</p>
          {submitted ? <p className="success-note"><Check size={16} /> You’re on the list. Nice.</p> : <form className="signup-form" onSubmit={submit}><label className="sr-only" htmlFor="signup-email">Email address</label><input id="signup-email" type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} required /><button className="icon-submit" aria-label="Sign up"><ArrowRight size={17} /></button></form>}
        </div>
      </div>
      <div className="footer-bottom"><span>© 2025 Chiku. Good questions, better hair days.</span><span>Made with care in India <span className="footer-spark">✳</span></span><Link to="/story">Privacy, please</Link></div>
    </footer>
  )
}

function Layout({ state, children }: { state: ChikuState; children: React.ReactNode }) {
  const location = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) }, [location.pathname])
  return <><Header state={state} /><main><AnimatePresence mode="wait"><motion.div key={location.pathname} {...pageMotion}>{children}</motion.div></AnimatePresence></main><Footer /></>
}

function SectionTitle({ eyebrow, title, copy, centered = false }: { eyebrow: string; title: string; copy?: string; centered?: boolean }) {
  return <div className={`section-title ${centered ? 'text-center' : ''}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
}

function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const faqs = [
    ['How does the match work?', 'A few thoughtful questions about your scalp, strands and routine help us recommend one of seven formulas. You’ll see exactly why it made the cut.'],
    ['Is this a medical treatment?', 'Nope. Chiku is personal haircare, not a medical product. If something about your scalp is worrying you, a dermatologist is the right person to ask.'],
    ['Can I change my formula later?', 'Absolutely. Hair changes with seasons, routines and plot twists. Retake the quiz whenever your needs change.'],
    ['What happens to my answers?', 'Your answers stay in this browser in this demo. We use them to show your match and never sell or share them.'],
  ]
  return <div className="home-page">
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" />PERSONAL HAIRCARE, STARTING WITH SHAMPOO</span><h1>{brand.homeHeadline}</h1><p>{brand.note}</p><div className="hero-actions"><Link to="/quiz" className="button button-dark">Find my formula <ArrowRight size={16} /></Link><Link to="/formulas" className="text-link">Meet the seven <ArrowDown size={15} /></Link></div><div className="hero-proof"><span className="avatar-stack"><i>R</i><i>A</i><i>M</i></span><span>Made around <strong>your</strong> hair. Not the other way around.</span></div></div>
      <div className="hero-art" aria-label="Illustration of a personalised Chiku bottle"><div className="hero-sun" /><span className="hero-sticker">a good<br />hair day<br /><b>starts here</b></span><div className="hero-leaf leaf-a" /><div className="hero-leaf leaf-b" /><Bottle formula={formulas[4]} size="large" /><div className="hero-caption"><Sparkles size={14} /> your hair, in the main character era</div></div>
      <a href="#how" className="hero-scroll"><span>SCROLL A LITTLE</span><ArrowDown size={15} /></a>
    </section>
    <section className="steps-section section-pad" id="how"><SectionTitle eyebrow="A VERY GOOD PLACE TO START" title="Three steps. One very you shampoo." copy="No aisle overwhelm. No guessy guess. Just a little conversation." centered /><div className="steps-grid">{[['01', 'Tell us', 'A few quick questions about your scalp, hair and everyday life.'], ['02', 'Get matched', 'We’ll find the formula that fits — and tell you exactly why.'], ['03', 'Make it yours', 'Choose your bottle details. Your name looks good on it.']].map(([number, title, copy], i) => <motion.div className="step-card" key={number} whileHover={{ y: -5 }}><span className="step-number">{number}<span>{i === 0 ? '✳' : i === 1 ? '↗' : '♡'}</span></span><h3>{title}</h3><p>{copy}</p></motion.div>)}</div></section>
    <section className="generic-section"><div className="generic-illustration"><div className="generic-loop"><span>one size</span><span>fits all?</span><i>NOPE.</i></div><div className="generic-small">A tiny plot twist<br />for your shower shelf.</div></div><div className="generic-copy"><span className="eyebrow">THE CASE FOR PERSONAL</span><h2>Your hair isn’t generic.<br /><em>Why should your shampoo be?</em></h2><p>Oily roots, dry ends, hard water, the occasional at-home colour experiment. Hair has context. Most shampoo bottles don’t ask.</p><p>We do. Then we give you a clear, considered place to start.</p><Link to="/story" className="text-link">A little more about us <ArrowRight size={15} /></Link></div></section>
    <section className="formula-preview section-pad"><div className="section-row"><SectionTitle eyebrow="SEVEN WAYS TO SAY 'THAT'S ME'" title="Meet the formula family." copy="Professionally developed formulas, each with a point of view." /><Link to="/formulas" className="text-link desktop-only">See all seven <ArrowRight size={15} /></Link></div><div className="formula-grid">{formulas.slice(0, 4).map((formula, i) => <FormulaCard key={formula.id} formula={formula} index={i} compact />)}</div><Link to="/formulas" className="button button-outline mobile-only">Explore all formulas <ArrowRight size={15} /></Link></section>
    <section className="personal-section"><div className="personal-art"><div className="personal-circle" /><Bottle formula={formulas[1]} /><span className="personal-note note-top">your name, right there <span>↘</span></span><span className="personal-note note-bottom">not just another bottle</span></div><div className="personal-copy"><span className="eyebrow">THE FUN BIT</span><h2>A bottle with your name on it.<br /><em>Because, obviously.</em></h2><p>Pick your size, label colour and a scent that feels like your kind of shower. Small ritual, upgraded.</p><Link to="/quiz" className="button button-dark">Get matched first <ArrowRight size={15} /></Link></div></section>
    <section className="refill-section section-pad"><div className="refill-copy"><span className="eyebrow">THE LONG GAME</span><h2>Good hair days.<br /><em>Less bottle waste.</em></h2><p>Love your formula? Keep the bottle, refill when you’re ready. Same you, less packaging doing the most.</p><Link to="/account" className="text-link">How reordering works <ArrowRight size={15} /></Link></div><div className="refill-graphic"><div className="refill-ring" /><div className="refill-pouch"><span>chiku</span><i>REFILL<br />YOUR<br />RITUAL</i></div><span className="refill-caption">keep the good bottle around</span></div></section>
    <section className="faq-section section-pad"><SectionTitle eyebrow="THE QUICK ANSWERS" title="Good questions, welcome here." /><div className="faq-list">{faqs.map(([question, answer], i) => <div className={`faq-item ${activeFaq === i ? 'faq-active' : ''}`} key={question}><button onClick={() => setActiveFaq(activeFaq === i ? null : i)} aria-expanded={activeFaq === i}><span>{question}</span><span className="faq-icon">{activeFaq === i ? <Minus size={17} /> : <Plus size={17} />}</span></button><AnimatePresence>{activeFaq === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{answer}</motion.p>}</AnimatePresence></div>)}</div><div className="faq-foot"><CircleHelp size={18} /> Still curious? <a href="mailto:hello@chiku.example">Say hello</a></div></section>
  </div>
}

function Story() {
  return <div className="content-page story-page"><section className="page-hero story-hero"><span className="eyebrow">A LITTLE ABOUT US</span><h1>Haircare that starts<br />with <em>listening.</em></h1><p>Because “for all hair types” has never really felt like it was for you.</p><div className="story-orbit"><div className="story-orbit-center">chiku<span>✳</span></div><span className="orbit-word word-one">your scalp</span><span className="orbit-word word-two">your city</span><span className="orbit-word word-three">your routine</span><span className="orbit-word word-four">your hair</span></div></section>
    <section className="story-block section-pad"><div><span className="eyebrow">THE WHY</span><h2>One bottle can’t know everyone.</h2></div><div className="story-body"><p>Hair is wonderfully inconsistent. Your scalp gets oily in Mumbai, feels different in Jaipur, and somehow your ends are dry in both places. Add water, weather, workout plans and the colour you got on a Tuesday — there’s a lot going on.</p><p>Chiku begins with a better question: what does <em>your</em> hair need right now? We use your answers to match you with one of seven professionally developed shampoo formulas. Then we make the bottle feel like it belongs to you, too.</p></div></section>
    <section className="story-process section-pad"><SectionTitle eyebrow="THE CHIKU WAY" title="Personal, without making it complicated." centered /><div className="process-row">{[['01', 'You tell us', 'Scalp, strands, habits and the water situation.'], ['02', 'We connect the dots', 'A simple weighted match points you to a formula.'], ['03', 'We show our work', 'Your results explain what in your answers mattered.']].map((item) => <div className="process-item" key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></div>)}</div></section>
    <section className="promise-section"><div className="promise-mark"><Leaf size={31} /></div><div><span className="eyebrow">OUR TRANSPARENCY PROMISE</span><h2>No mystery match. We’ll show you why.</h2><p>Your answers are used to make your recommendation, not to make you feel like a data point. We’ll explain the clues we noticed, and your profile stays in your browser in this demo.</p></div></section>
    <div className="center-cta"><p>Ready to meet your formula?</p><Link className="button button-dark" to="/quiz">Let’s find out <ArrowRight size={15} /></Link></div>
  </div>
}

function FormulasPage() {
  return <div className="content-page formulas-page"><section className="page-hero compact-hero"><span className="eyebrow">THE FORMULA FAMILY</span><h1>Seven formulas.<br /><em>Not one-size-fits-all.</em></h1><p>Each one has a job. Your answers help us pick the right teammate.</p></section><div className="all-formulas">{formulas.map((formula, i) => <FormulaCard key={formula.id} formula={formula} index={i} />)}</div><div className="formula-disclaimer"><LockKeyhole size={15} /> These are personal care formulas, not medical treatments. If you have a scalp concern, please talk to a qualified professional.</div><div className="center-cta"><p>Want to see which one feels like you?</p><Link to="/quiz" className="button button-dark">Find my formula <ArrowRight size={15} /></Link></div></div>
}

function Question({ question, value, onChange }: { question: QuizQuestion; value: string | string[] | undefined; onChange: (value: string | string[]) => void }) {
  const current = Array.isArray(value) ? value : value ? [value] : []
  if (question.type === 'text') return <div className="city-input-wrap"><input className="city-input" autoFocus aria-label="Your city" placeholder="e.g. Bengaluru" value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value)} /><span>We don’t need your exact address. Just the city.</span></div>
  return <div className={`answer-grid ${question.type === 'multiple' || question.type === 'priority' ? 'answer-grid-many' : ''}`}>
    {question.options?.map((option) => {
      const selected = current.includes(option)
      return <motion.button type="button" className={`answer-option ${selected ? 'answer-selected' : ''}`} key={option} onClick={() => {
        if (question.type === 'multiple' || question.type === 'priority') {
          if (selected) onChange(current.filter((item) => item !== option))
          else if (current.length < (question.max ?? Infinity)) onChange([...current, option])
        } else onChange(option)
      }} whileTap={{ scale: .98 }}><span className="answer-indicator">{selected ? <Check size={15} /> : question.type === 'single' ? <i /> : null}</span><span>{option}</span>{question.type === 'single' && <ChevronRight className="answer-arrow" size={16} />}</motion.button>
    })}
  </div>
}

function Quiz({ state, updateState, finishQuiz }: { state: ChikuState; updateState: (fn: (state: ChikuState) => ChikuState) => void; finishQuiz: () => void }) {
  const navigate = useNavigate()
  const firstBlank = quizQuestions.findIndex((question) => {
    const answer = state.answers[question.id]
    return !answer || (Array.isArray(answer) && answer.length === 0) || (question.type === 'text' && !String(answer).trim())
  })
  const [index, setIndex] = useState(firstBlank < 0 ? 0 : firstBlank)
  const question = quizQuestions[index]
  const answer = state.answers[question.id]
  const filled = Boolean(answer && (!Array.isArray(answer) || answer.length > 0) && (question.type !== 'text' || String(answer).trim()))
  const progress = ((index + 1) / quizQuestions.length) * 100
  const change = (value: string | string[]) => updateState((old) => ({ ...old, answers: { ...old.answers, [question.id]: value } }))
  const next = () => {
    if (!filled) return
    if (index === quizQuestions.length - 1) { finishQuiz(); navigate('/results') }
    else setIndex((n) => n + 1)
  }
  const previous = () => index ? setIndex((n) => n - 1) : navigate('/')
  return <div className="quiz-page">
    <div className="quiz-top"><Link to="/" className="quiz-logo"><Logo /></Link><button className="quiz-save" onClick={() => navigate('/')}>Save &amp; exit <X size={15} /></button></div>
    <div className="quiz-progress"><div className="progress-meta"><span>{question.section}</span><span>{String(index + 1).padStart(2, '0')} <i>/</i> {String(quizQuestions.length).padStart(2, '0')}</span></div><div className="progress-track"><motion.div animate={{ width: `${progress}%` }} transition={{ duration: .35 }} /></div></div>
    <div className="quiz-body">
      <button className="back-button" onClick={previous}><ArrowLeft size={16} /> Back</button>
      <AnimatePresence mode="wait"><motion.div className="question-content" key={question.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .22 }}>
        <div className="question-spark">✳</div><h1>{question.title}</h1><p className="question-helper">{question.helper}</p>
        {(question.type === 'multiple' || question.type === 'priority') && <span className="selection-count">{currentCount(answer)} selected{question.type === 'priority' ? ' · up to 3' : ''}</span>}
        <Question question={question} value={answer} onChange={change} />
      </motion.div></AnimatePresence>
      <div className="quiz-bottom"><span className="quiz-note">{index === 0 ? 'This takes about two minutes.' : 'Your answers save as you go.'}</span><button className="button button-dark" onClick={next} disabled={!filled}>{index === quizQuestions.length - 1 ? 'Show my match' : 'Keep going'} <ArrowRight size={16} /></button></div>
    </div>
    <div className="quiz-privacy"><LockKeyhole size={13} /> Your answers are yours. In this demo, they stay on this device.</div>
  </div>
}

function currentCount(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.length : value ? 1 : 0
}

function Results({ state }: { state: ChikuState }) {
  const match = useMemo(() => scoreFormulas(state.answers), [state.answers])
  const chosen = formulas.find((formula) => formula.id === state.formulaId) ?? match[0].formula
  const runnerUp = match.find((item) => item.formula.id !== chosen.id)?.formula ?? formulas[1]
  const reasons = getMatchReason(state.answers, chosen.id)
  return <div className="results-page"><section className="results-top"><span className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL MATCH IS IN</span><h1>We think you’ll get along<br />with <em>{chosen.name}.</em></h1><p>A little less guesswork. A lot more <i>you.</i></p></section><section className="result-card"><div className="result-bottle"><span className="result-confetti confetti-a">✳</span><span className="result-confetti confetti-b">✳</span><Bottle formula={chosen} /></div><div className="result-detail"><span className="formula-pill" style={{ background: chosen.color }}>NO. {chosen.id} · {chosen.concern}</span><h2>{chosen.name}</h2><p>{chosen.description}</p><div className="why-box"><span className="eyebrow">WHY THIS FORMULA FOR YOU</span>{reasons.map((reason) => <div className="reason-row" key={reason}><span><Check size={13} /></span><p>Because {reason}.</p></div>)}</div><Link to="/customise" className="button button-dark">Customise my bottle <ArrowRight size={16} /></Link><p className="privacy-caption"><LockKeyhole size={13} /> Your answers make this match. In this demo, they stay in your browser.</p></div></section><section className="runner-up"><span className="eyebrow">ALSO IN THE RUNNING</span><FormulaCard formula={runnerUp} compact /><p>Your top match had the closest fit. This one was a near second.</p></section><div className="center-cta"><Link to="/quiz" className="text-link">Not quite you? Retake the quiz <ArrowRight size={15} /></Link></div></div>
}

function Customise({ state, updateState }: { state: ChikuState; updateState: (fn: (state: ChikuState) => ChikuState) => void }) {
  const navigate = useNavigate()
  const formula = formulas.find((item) => item.id === state.formulaId) ?? formulas[0]
  const bottle = state.bottle ?? defaultBottle
  const price = prices.find((item) => item.size === bottle.size)?.amount ?? 300
  const setBottle = (field: keyof BottleConfig, value: string | boolean) => updateState((old) => ({ ...old, bottle: { ...(old.bottle ?? defaultBottle), [field]: value } }))
  const addToCart = () => {
    updateState((old) => ({ ...old, bottle, cart: [...old.cart, { formulaId: formula.id, bottle, quantity: 1, price }] }))
    navigate('/cart')
  }
  return <div className="customise-page"><div className="customise-heading"><span className="eyebrow">YOUR MATCH, YOUR BOTTLE</span><h1>A few little details.<br /><em>Then it’s yours.</em></h1><p>Meet {formula.name}, now with your name on it.</p></div><div className="customise-layout"><div className="custom-preview"><div className="preview-label"><span className="live-dot" /> LIVE PREVIEW</div><div className="preview-stage"><div className="preview-sun" /><Bottle formula={formula} bottle={bottle} /><span className="preview-caption">made around you, down to the label</span></div></div><div className="custom-controls">
      <fieldset className="control-group"><legend>Pick your size <span>01</span></legend><div className="size-options">{prices.map(({ size, amount }) => <button key={size} className={`size-option ${bottle.size === size ? 'size-selected' : ''}`} onClick={() => setBottle('size', size)} aria-pressed={bottle.size === size}><strong>{size}</strong><span>{money(amount)}</span></button>)}</div></fieldset>
      <div className="control-group"><label htmlFor="bottle-name">Put a name on it <span>02</span></label><div className="name-field"><input id="bottle-name" maxLength={18} placeholder="Your name or nickname" value={bottle.name} onChange={(e) => setBottle('name', e.target.value)} /><span>{bottle.name.length}/18</span></div><span className="field-note">A nickname is excellent. Main character energy, optional.</span></div>
      <fieldset className="control-group"><legend>Choose a label mood <span>03</span></legend><div className="color-options">{[['#e8d2b5', 'Oat milk'], ['#d3d8b5', 'Pistachio'], ['#e7c2ac', 'Apricot'], ['#d7c7d5', 'Lilac dusk'], ['#d3dfe0', 'Sea glass']].map(([color, name]) => <button key={color} className={`color-choice ${bottle.color === color ? 'color-selected' : ''}`} title={name} aria-label={`${name} label`} aria-pressed={bottle.color === color} style={{ background: color }} onClick={() => setBottle('color', color)}>{bottle.color === color && <Check size={15} />}</button>)}</div><span className="field-note">{[['#e8d2b5', 'Oat milk'], ['#d3d8b5', 'Pistachio'], ['#e7c2ac', 'Apricot'], ['#d7c7d5', 'Lilac dusk'], ['#d3dfe0', 'Sea glass']].find(([color]) => color === bottle.color)?.[1]}</span></fieldset>
      <div className="control-group"><label htmlFor="fragrance">Set the shower mood <span>04</span></label><div className="select-wrap"><select id="fragrance" value={bottle.fragrance} onChange={(e) => setBottle('fragrance', e.target.value)}>{fragrances.map((fragrance) => <option key={fragrance}>{fragrance}</option>)}</select><ChevronDown size={16} /></div></div>
      <button className={`refill-toggle ${bottle.refill ? 'refill-on' : ''}`} onClick={() => setBottle('refill', !bottle.refill)} aria-pressed={bottle.refill}><span className="toggle-check">{bottle.refill && <Check size={13} />}</span><span><strong>Save a refill pouch for later</strong><small>Keep this bottle. Refill it when you’re ready.</small></span><span className="toggle-spark">✳</span></button>
      <div className="add-cart-row"><div><span className="eyebrow">YOUR BOTTLE</span><strong>{money(price)}</strong></div><button className="button button-dark" onClick={addToCart}>Add to cart <ArrowRight size={16} /></button></div>
    </div></div></div>
}

function Cart({ state, updateState }: { state: ChikuState; updateState: (fn: (state: ChikuState) => ChikuState) => void }) {
  const navigate = useNavigate()
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const updateQuantity = (index: number, amount: number) => updateState((old) => ({ ...old, cart: old.cart.map((item, i) => i === index ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0) }))
  const remove = (index: number) => updateState((old) => ({ ...old, cart: old.cart.filter((_, i) => i !== index) }))
  return <div className="cart-page content-page"><section className="cart-heading"><span className="eyebrow">THE GOOD STUFF</span><h1>Your cart, <em>your call.</em></h1><p>A little check before your new shower ritual begins.</p></section>{state.cart.length ? <div className="cart-layout"><div className="cart-items">{state.cart.map((item, index) => {
    const formula = formulas.find((entry) => entry.id === item.formulaId) ?? formulas[0]
    return <article className="cart-item" key={`${index}-${item.formulaId}`}><div className="cart-item-art"><Bottle formula={formula} bottle={item.bottle} size="small" /></div><div className="cart-item-info"><span className="eyebrow">NO. {formula.id} · {formula.concern}</span><h3>{formula.name}</h3><p>{item.bottle.size} · {item.bottle.fragrance}</p><p>Label for <strong>{item.bottle.name || 'you'}</strong></p><button className="remove-button" onClick={() => remove(index)}>Remove</button></div><div className="cart-item-actions"><strong>{money(item.price * item.quantity)}</strong><div className="quantity-control"><button onClick={() => updateQuantity(index, -1)} aria-label="Decrease quantity"><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(index, 1)} aria-label="Increase quantity"><Plus size={14} /></button></div></div></article>
  })}<Link to="/customise" className="continue-shopping"><ArrowLeft size={15} /> Add another bottle</Link></div><aside className="cart-summary"><span className="eyebrow">ORDER SUMMARY</span><div><span>Subtotal</span><strong>{money(total)}</strong></div><div><span>Shipping</span><span>Calculated at checkout</span></div><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div><button className="button button-dark full-button" onClick={() => navigate('/checkout')}>Continue to checkout <ArrowRight size={16} /></button><p><LockKeyhole size={13} /> Mock checkout. No payment details needed.</p></aside></div> : <div className="empty-cart"><div className="empty-bag"><ShoppingBag size={27} /></div><h2>Nothing in the bag. Yet.</h2><p>Your formula is out there, minding its business. Let’s find it.</p><Link to={state.formulaId ? '/customise' : '/quiz'} className="button button-dark">{state.formulaId ? 'Customise your bottle' : 'Find my formula'} <ArrowRight size={15} /></Link></div>}</div>
}

function Checkout({ state, updateState }: { state: ChikuState; updateState: (fn: (state: ChikuState) => ChikuState) => void }) {
  const [placed, setPlaced] = useState(false)
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return <div className="checkout-page content-page"><span className="eyebrow">A MOCK CHECKOUT, FOR NOW</span>{placed ? <div className="order-success"><div className="success-burst">✳</div><h1>That’s a <em>wrap.</em></h1><p>Your pretend order is all set. In a real Chiku world, we’d be getting your bottle ready right about now.</p><Link to="/account" className="button button-dark">Go to My Chiku <ArrowRight size={15} /></Link></div> : <><h1>One last look.<br /><em>Then, good things.</em></h1><div className="checkout-card"><div><h2>Order summary</h2>{state.cart.map((item, i) => <div className="checkout-line" key={i}><span>{formulas.find((f) => f.id === item.formulaId)?.name ?? 'Chiku shampoo'} · {item.bottle.size} × {item.quantity}</span><strong>{money(item.price * item.quantity)}</strong></div>)}<div className="checkout-line checkout-total"><strong>Total</strong><strong>{money(total)}</strong></div></div><div className="checkout-address"><h2>Delivery details</h2><p>No address needed in this demo. Your cart is saved right here in your browser.</p>{state.user ? <span className="signed-in-note"><Check size={14} /> Signed in as {state.user.email}</span> : <Link to="/auth" className="text-link">Log in to save your profile <ArrowRight size={15} /></Link>}</div><button className="button button-dark full-button" onClick={() => { updateState((old) => ({ ...old, cart: [] })); setPlaced(true) }}>Place mock order <ArrowRight size={16} /></button><p className="checkout-fine"><LockKeyhole size={13} /> Front end only. No payment is collected.</p></div></>}</div>
}

function Auth({ state, updateState }: { state: ChikuState; updateState: (fn: (state: ChikuState) => ChikuState) => void }) {
  const [signup, setSignup] = useState(false)
  const [notice, setNotice] = useState('')
  const navigate = useNavigate()
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email')).trim()
    updateState((old) => ({ ...old, user: { email } }))
    setNotice('You’re in. Your Chiku profile is right where you left it.')
    setTimeout(() => navigate('/account'), 950)
  }
  return <div className="auth-page"><div className="auth-art"><div className="auth-sun" /><Bottle formula={formulas[state.formulaId ? state.formulaId - 1 : 4]} /><span>your bathroom shelf<br />called. it wants this.</span></div><div className="auth-form-panel"><span className="eyebrow">YOUR LITTLE CORNER OF CHIKU</span><div className="auth-toggle"><button className={!signup ? 'auth-tab-active' : ''} onClick={() => setSignup(false)}>Log in</button><button className={signup ? 'auth-tab-active' : ''} onClick={() => setSignup(true)}>Sign up</button></div><h1>{signup ? 'Let’s make it official.' : 'Welcome back.'}</h1><p>Your formula and bottle details, right where you left them.</p><form onSubmit={submit}><label htmlFor="auth-email">Email address</label><input id="auth-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /><label htmlFor="auth-password">Password</label><input id="auth-password" name="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} placeholder="At least 8 characters" required minLength={8} /><button className="button button-dark full-button" type="submit">{signup ? 'Create my account' : 'Log in'} <ArrowRight size={16} /></button></form><div className="auth-divider"><span>OR</span></div><button className="google-button" onClick={() => setNotice('Google sign-in is a visual placeholder for now.')}><span className="google-g">G</span> Continue with Google</button>{notice && <p className="auth-notice"><Check size={14} /> {notice}</p>}<p className="auth-microcopy">No awkward welcome emails. Just your profile, safe and sound.</p><p className="auth-local-note"><LockKeyhole size={13} /> Demo only: your sign-in is saved on this device.</p></div></div>
}

function Account({ state, updateState }: { state: ChikuState; updateState: (fn: (state: ChikuState) => ChikuState) => void }) {
  const navigate = useNavigate()
  const formula = formulas.find((item) => item.id === state.formulaId)
  const reorder = () => {
    const bottle = state.bottle ?? defaultBottle
    const price = prices.find((item) => item.size === bottle.size)?.amount ?? 300
    updateState((old) => ({ ...old, cart: [...old.cart, { formulaId: formula?.id ?? 4, bottle: { ...bottle, refill: true }, quantity: 1, price }] }))
    navigate('/cart')
  }
  if (!state.user && !formula) return <div className="account-empty content-page"><div className="empty-bag"><Sparkles size={27} /></div><span className="eyebrow">YOUR CHIKU, YOUR CALL</span><h1>Your hair profile<br /><em>starts here.</em></h1><p>Take the quiz to find your formula. Sign in if you’d like to keep your little corner of Chiku.</p><div className="empty-actions"><Link to="/quiz" className="button button-dark">Take the quiz <ArrowRight size={15} /></Link><Link to="/auth" className="text-link">Log in or sign up</Link></div></div>
  return <div className="account-page content-page"><div className="account-heading"><div><span className="eyebrow">YOUR LITTLE CORNER</span><h1>My <em>Chiku.</em></h1><p>{state.user?.email ?? 'Your profile is saved on this device.'}</p></div><Link to="/quiz" className="text-link">Retake the quiz <ArrowRight size={15} /></Link></div><div className="account-grid"><section className="account-profile"><div className="account-section-head"><span className="eyebrow">YOUR HAIR PROFILE</span><Link to="/quiz" aria-label="Retake quiz"><ArrowRight size={15} /></Link></div><div className="profile-monogram">c<span>✳</span></div><h2>{state.answers.city ? `A little note from ${state.answers.city}` : 'A profile that gets you.'}</h2><p>We’ve kept your answers handy, so you don’t have to start from scratch next time.</p><div className="profile-pills">{[state.answers.scalp, state.answers.strand, ...(Array.isArray(state.answers.concerns) ? state.answers.concerns.slice(0, 2) : [])].filter(Boolean).map((answer) => <span key={String(answer)}>{answer}</span>)}</div><Link to="/quiz" className="text-link">Update my answers <ArrowRight size={14} /></Link></section><section className="account-match"><span className="eyebrow">YOUR FORMULA</span>{formula ? <><div className="account-match-main"><div className="account-formula-swatch" style={{ background: formula.color }}><span>NO.<br />{formula.id}</span></div><div><h2>{formula.name}</h2><p>{formula.concern}</p></div></div><p>{formula.description}</p><div className="account-bottle-row"><div><strong>{state.bottle?.name || 'Your personalised bottle'}</strong><span>{state.bottle?.size ?? '200 ml'} · {state.bottle?.fragrance ?? 'Nimbu, Naturally'}</span></div><span className="saved-bottle-dot" style={{ background: state.bottle?.color ?? defaultBottle.color }} /></div><button onClick={reorder} className="button button-dark full-button">Reorder this bottle <ArrowRight size={15} /></button><span className="account-refill"><Leaf size={14} /> We’ll add a refill pouch note for your next order.</span></> : <div className="account-no-match"><p>Your match will live here after the quiz.</p><Link to="/quiz" className="button button-dark">Find my formula <ArrowRight size={15} /></Link></div>}</section></div><button className="signout-button" onClick={() => updateState((old) => ({ ...old, user: null }))}>Log out on this device</button></div>
}

function NotFound() {
  return <div className="not-found"><div className="not-found-fruit">✳</div><span className="eyebrow">404 · THIS PAGE WASHED AWAY</span><h1>Looks like a<br /><em>bad hair day.</em></h1><p>We can’t find that page, but we can help you find your formula.</p><Link to="/" className="button button-dark">Back to Chiku <ArrowRight size={15} /></Link></div>
}

export default function App() {
  const [state, setState] = useState<ChikuState>(loadState)
  useEffect(() => saveState(state), [state])
  const updateState = (fn: (state: ChikuState) => ChikuState) => setState(fn)
  const finishQuiz = () => {
    const match = scoreFormulas(state.answers)[0].formula
    setState((old) => ({ ...old, formulaId: match.id }))
  }
  return <Layout state={state}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/story" element={<Story />} />
    <Route path="/formulas" element={<FormulasPage />} />
    <Route path="/quiz" element={<Quiz state={state} updateState={updateState} finishQuiz={finishQuiz} />} />
    <Route path="/results" element={<Results state={state} />} />
    <Route path="/customise" element={<Customise state={state} updateState={updateState} />} />
    <Route path="/cart" element={<Cart state={state} updateState={updateState} />} />
    <Route path="/checkout" element={<Checkout state={state} updateState={updateState} />} />
    <Route path="/auth" element={<Auth state={state} updateState={updateState} />} />
    <Route path="/account" element={<Account state={state} updateState={updateState} />} />
    <Route path="*" element={<NotFound />} />
  </Routes></Layout>
}
