import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const viewportRef = useRef(null);
  const [index, setIndex] = useState(0);

  const slides = useMemo(
    () => [
      {
        title:
          "Giving up junk food and taking timely medication didn't help with your PCOS",
        image:
          'https://images.pexels.com/photos/3951616/pexels-photo-3951616.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600',
      },
      {
        title: 'Efforts to eat clean and exercise still not showing results?',
        image:
          'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600',
      },
      {
        title: 'Feeling overwhelmed by conflicting advice online?',
        image:
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    []
  );

  const scrollToIndex = (i) => {
    if (viewportRef.current) {
      const el = viewportRef.current;
      el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    }
  };

  const onPrev = () => {
    setIndex((i) => {
      const next = Math.max(0, i - 1);
      scrollToIndex(next);
      return next;
    });
  };

  const onNext = () => {
    setIndex((i) => {
      const next = Math.min(slides.length - 1, i + 1);
      scrollToIndex(next);
      return next;
    });
  };

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % slides.length;
        requestAnimationFrame(() => scrollToIndex(next));
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  const handleCTA = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#D4E157',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: 'min(780px, 92%)',
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background:
              'linear-gradient(180deg, rgba(251,226,228,1) 0%, rgba(248,187,208,1) 100%)',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              lineHeight: 1.2,
              color: '#1F2937',
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            Can you relate ?
          </h1>
          <p
            style={{
              marginTop: 8,
              textAlign: 'center',
              color: '#6B7280',
              fontSize: 14,
            }}
          >
            Have you come across the below given scenarios?
          </p>
        </div>

        <div
          style={{
            position: 'relative',
            padding: '16px 0 8px',
          }}
        >
          <div
            ref={viewportRef}
            style={{
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              display: 'flex',
            }}
            onScroll={(e) => {
              const el = e.currentTarget;
              const i = Math.round(el.scrollLeft / el.clientWidth);
              setIndex(i);
            }}
          >
            {slides.map((s, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: '100%',
                  padding: '0 24px 16px',
                  boxSizing: 'border-box',
                  scrollSnapAlign: 'center',
                }}
              >
                <div
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(252,231,243,1) 0%, rgba(248,191,208,1) 100%)',
                    borderRadius: 16,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div className="slide-media">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1512621776951-47a6fdc473eb?auto=format&fit=crop&w=1600&q=80';
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: '#111827',
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {s.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
            }}
          >
            {slides.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === index ? '#7e22ce' : '#e5e7eb',
                }}
              />
            ))}
          </div>

          <div className="cta-inline" style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '8px 0 16px' }}>
            <button
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: 10,
                fontWeight: 700,
              }}
              onClick={handleCTA}
            >
              <Play size={18} />
              Start your PCOS check
            </button>
            <button
              className="btn"
              style={{ background: '#f3f4f6', color: '#374151' }}
              onClick={() => navigate('/login')}
            >
              <ChevronRight size={18} />
              Login
            </button>
          </div>

          <button
            aria-label="Previous"
            onClick={onPrev}
            style={{
              position: 'absolute',
              top: '50%',
              left: 8,
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 999,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next"
            onClick={onNext}
            style={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 999,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
            type="button"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      {/* Mobile sticky CTA bar */}
      <div className="sticky-cta">
        <div style={{ display: 'flex', gap: 12, maxWidth: 780, margin: '0 auto', padding: '8px 16px' }}>
          <button
            className="btn"
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: 10,
              fontWeight: 700
            }}
            onClick={handleCTA}
          >
            <Play size={18} />
            Start your PCOS check
          </button>
          <button
            className="btn"
            style={{ flex: 1, background: '#f3f4f6', color: '#374151' }}
            onClick={() => navigate('/login')}
          >
            <ChevronRight size={18} />
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;


