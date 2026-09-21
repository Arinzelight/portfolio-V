import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import ResumeTailorModal from '../ai/ResumeTailorModal';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 480px) {
    height: auto;
    min-height: 100vh;
    padding-top: var(--nav-height);
    padding-bottom: 40px;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  & > div {
    width: 100%;
  }

  .cta-wrapper {
    display: flex;
    gap: 1.25rem;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 50px;
    width: 100%;

    .email-link {
      margin-top: 0;
      white-space: nowrap;
    }

    button.email-link {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 1px solid var(--green);
      color: var(--green);
      cursor: pointer;
      font-family: inherit;
    }

    .mobile-text {
      display: none;
    }

    .desktop-text {
      display: inline;
    }

    @media (max-width: 768px) {
      margin-top: 32px;
      gap: 12px;
      flex-wrap: nowrap;
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 8px;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }

      .email-link {
        flex: 1 0 auto;
        min-width: max-content;
        padding: 0.85rem 1.25rem;
        font-size: var(--fz-xs);
        line-height: 1.2;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        white-space: nowrap;
        box-sizing: border-box;

        &:hover,
        &:focus-visible {
          box-shadow: 3px 3px 0 0 var(--green);
          transform: translate(-3px, -3px);
        }
      }
    }

    @media (max-width: 480px) {
      gap: 8px;

      .email-link {
        padding: 0.8rem 1.15rem;
        font-size: clamp(11.5px, 2.8vw, 13px);
      }

      .desktop-text {
        display: none;
      }

      .mobile-text {
        display: inline;
      }
    }
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isTailorOpen, setIsTailorOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Harry Ezinwa.</h2>;
  const three = <h3 className="big-heading">I build scalable web & mobile products.</h3>;
  const four = (
    <>
      <p>
        I’m a Full-Stack Software Engineer and Frontend Team Lead with over 4 years of experience
        building, scaling, and maintaining production-ready web and mobile applications. Currently,
        I lead frontend engineering at{' '}
        <a href="https://horal.ng/" target="_blank" rel="noreferrer">
          Horal
        </a>
        , delivering high-performance platforms across React, React Native, and robust backend APIs.
      </p>
    </>
  );
  const five = (
    <div className="cta-wrapper">
      <a className="email-link" href="/#contact" aria-label="Get In Touch">
        <span className="desktop-text">Get In Touch</span>
        <span className="mobile-text">Contact</span>
      </a>
      <a
        className="email-link"
        href="https://drive.google.com/file/d/1IrWMXYApV_K3bwq_5yQsJY7ICM1_RIyA/view?usp=sharing"
        target="_blank"
        rel="noreferrer"
        aria-label="View Resume">
        <span className="desktop-text">View Resume</span>
        <span className="mobile-text">Resume</span>
      </a>
      <button
        type="button"
        className="email-link"
        onClick={() => setIsTailorOpen(true)}
        aria-label="Tailor resume to job description">
        ✨ Tailor to Job
      </button>
    </div>
  );

  const items = [one, two, three, four, five];

  return (
    <>
      <StyledHeroSection>
        {prefersReducedMotion ? (
          <>
            {items.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {isMounted &&
              items.map((item, i) => (
                <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                  <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </StyledHeroSection>

      <ResumeTailorModal isOpen={isTailorOpen} onClose={() => setIsTailorOpen(false)} />
    </>
  );
};

export default Hero;
