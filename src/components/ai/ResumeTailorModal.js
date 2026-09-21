import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(2, 12, 27, 0.85);
  backdrop-filter: blur(5px);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: var(--light-navy);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: var(--border-radius);
  box-shadow: 0 25px 50px -12px rgba(2, 12, 27, 0.9);
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalScale 0.2s ease-out;

  @keyframes modalScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  background-color: var(--navy);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  h3 {
    margin: 0 0 5px;
    color: var(--lightest-slate);
    font-size: var(--fz-xl);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 0;
    font-size: var(--fz-xs);
    color: var(--slate);
  }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--slate);
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;

    &:hover {
      color: var(--green);
    }
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--dark-slate);
    border-radius: 4px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 140px;
  background-color: var(--navy);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  padding: 14px;
  color: var(--lightest-slate);
  font-family: var(--font-sans);
  font-size: var(--fz-sm);
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: var(--transition);

  &:focus {
    border-color: var(--green);
  }

  &::placeholder {
    color: var(--slate);
  }
`;

const SampleButton = styled.button`
  background: transparent;
  border: none;
  color: var(--green);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  text-align: left;
  align-self: flex-start;

  &:hover {
    color: var(--lightest-slate);
  }
`;

const ActionButton = styled.button`
  ${({ theme }) => theme.mixins.bigButton};
  align-self: flex-start;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .score-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--navy);
    padding: 16px 20px;
    border-radius: var(--border-radius);
    border: 1px solid rgba(100, 255, 218, 0.2);

    .score-badge {
      font-size: 28px;
      font-weight: 700;
      color: var(--green);
      font-family: var(--font-mono);
    }

    .role-title {
      color: var(--lightest-slate);
      font-size: var(--fz-md);
      font-weight: 600;
    }
  }

  .section-title {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .skills-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    span {
      background: rgba(100, 255, 218, 0.1);
      color: var(--green);
      border: 1px solid rgba(100, 255, 218, 0.3);
      border-radius: 4px;
      padding: 4px 10px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
    }
  }

  .strengths-list {
    margin: 0;
    padding-left: 20px;
    color: var(--light-slate);
    font-size: var(--fz-sm);

    li {
      margin-bottom: 6px;
    }
  }

  .projects-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .project-item {
      background: var(--navy);
      padding: 12px 16px;
      border-radius: var(--border-radius);
      border-left: 3px solid var(--green);

      strong {
        color: var(--lightest-slate);
        font-size: var(--fz-sm);
      }

      p {
        margin: 4px 0 0;
        font-size: var(--fz-xs);
        color: var(--slate);
      }
    }
  }

  .pitch-box {
    background: var(--navy);
    padding: 16px;
    border-radius: var(--border-radius);
    border: 1px solid rgba(255, 255, 255, 0.08);
    position: relative;

    p {
      margin: 0;
      color: var(--light-slate);
      font-size: var(--fz-sm);
      line-height: 1.5;
      font-style: italic;
    }

    button {
      margin-top: 10px;
      background: rgba(100, 255, 218, 0.1);
      color: var(--green);
      border: 1px solid var(--green);
      border-radius: 4px;
      padding: 4px 10px;
      font-size: var(--fz-xxs);
      font-family: var(--font-mono);
      cursor: pointer;

      &:hover {
        background: var(--green);
        color: var(--navy);
      }
    }
  }
`;

const SAMPLE_JOB_DESCRIPTION = `We are looking for a Senior Full-Stack Engineer to lead frontend development across web and mobile.
Key requirements:
- 3+ years experience with React, TypeScript, and modern state management
- Hands-on experience building mobile apps in React Native (iOS and Android)
- Experience designing RESTful APIs in Django or Node.js
- Proficiency with PostgreSQL and Redis caching
- Experience integrating payment gateways (e.g. Paystack, Stripe) and cloud storage
- Strong leadership skills and experience guiding developers.`;

const ResumeTailorModal = ({ isOpen, onClose }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to tailor resume.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while analyzing the job description.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPitch = () => {
    if (result && result.tailoredSummary) {
      navigator.clipboard.writeText(result.tailoredSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ModalBackdrop isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <h3>
              <span>✨</span> Smart Resume Tailoring
            </h3>
            <p>Paste a job description to see how Harry's background matches your opening</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </ModalHeader>

        <ModalBody>
          {!result ? (
            <>
              <Textarea
                placeholder="Paste the job description or role requirements here..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                disabled={loading}
              />

              <SampleButton type="button" onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}>
                ▹ Paste Sample Full-Stack / Mobile Job Description
              </SampleButton>

              {error && <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0 }}>{error}</p>}

              <ActionButton
                type="button"
                onClick={handleAnalyze}
                disabled={loading || jobDescription.trim().length < 20}>
                {loading ? 'Analyzing with Gemini AI...' : 'Analyze Match'}
              </ActionButton>
            </>
          ) : (
            <ResultCard>
              <div className="score-section">
                <div>
                  <div className="role-title">{result.detectedRole || 'Target Role Alignment'}</div>
                  <div style={{ color: 'var(--slate)', fontSize: '12px' }}>
                    Evaluated against Harry's verified experience
                  </div>
                </div>
                <div className="score-badge">{result.matchScore}% Match</div>
              </div>

              {result.matchedSkills && result.matchedSkills.length > 0 && (
                <div>
                  <div className="section-title">Matching Core Skills</div>
                  <div className="skills-wrap">
                    {result.matchedSkills.map((skill, i) => (
                      <span key={i}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.keyStrengths && result.keyStrengths.length > 0 && (
                <div>
                  <div className="section-title">Key Strengths for this Role</div>
                  <ul className="strengths-list">
                    {result.keyStrengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendedProjects && result.recommendedProjects.length > 0 && (
                <div>
                  <div className="section-title">Recommended Portfolio Projects</div>
                  <div className="projects-list">
                    {result.recommendedProjects.map((proj, i) => (
                      <div key={i} className="project-item">
                        <strong>{proj.name}</strong>
                        <p>{proj.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.tailoredSummary && (
                <div>
                  <div className="section-title">Tailored Candidate Pitch</div>
                  <div className="pitch-box">
                    <p>&ldquo;{result.tailoredSummary}&rdquo;</p>
                    <button type="button" onClick={handleCopyPitch}>
                      {copied ? '✓ Copied to clipboard!' : '📋 Copy Pitch'}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ActionButton
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setJobDescription('');
                  }}>
                  Test Another Role
                </ActionButton>
                <ActionButton
                  type="button"
                  as="a"
                  href="/#contact"
                  onClick={onClose}
                  style={{ textDecoration: 'none' }}>
                  Contact Harry
                </ActionButton>
              </div>
            </ResultCard>
          )}
        </ModalBody>
      </ModalContent>
    </ModalBackdrop>
  );
};

ResumeTailorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResumeTailorModal;
