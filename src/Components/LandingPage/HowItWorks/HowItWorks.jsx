import React from 'react'
import styles from "./HowItWorks.module.css"










const steps = [
  {
    number: 1,
    title: "Create Account",
    description: "Sign up and complete our secure identity verification process in minutes.",
    colorClass: "step-circle--gold",
  },
  {
    number: 2,
    title: "Launch or Discover",
    description: "Pitch your groundbreaking idea or browse curated high-potential startups.",
    colorClass: "step-circle--navy",
  },
  {
    number: 3,
    title: "Invest Securely",
    description: "Fund projects with confidence and track your returns seamlessly.",
    colorClass: "step-circle--green",
  },
];
export default function HowItWorks() {
  return (
   <>
    <section id='How-It-Works' className={styles.howItWorks}>

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>How It Works</h2>
        <p className={styles.subtitle}>
          Join thousands of founders and investors building the future together in three simple steps.
        </p>
      </div>

      {/* Steps */}
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={step.number} className={styles.stepWrapper}>

            {/* Step Card */}
            <div className={styles.step}>
              <div className={`${styles.circle} ${step.circleClass}`}>
                {step.number}
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>

            {/* Dashed connector */}
            {index < steps.length - 1 && (
              <div className={styles.connector} />
            )}

          </div>
        ))}
      </div>

    </section>
   
   
   </>
  )
}
