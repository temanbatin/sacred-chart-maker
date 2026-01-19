import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

describe('HeroSection', () => {
  const mockScrollToCalculator = vi.fn();

  const renderHeroSection = (userName?: string) => {
    return render(
      <BrowserRouter>
        <HeroSection
          onScrollToCalculator={mockScrollToCalculator}
          userName={userName}
        />
      </BrowserRouter>
    );
  };

  it('renders correctly for guest users', () => {
    renderHeroSection(undefined);

    // Check for main headline
    expect(screen.getByText(/Lelah Merasa Ada yang Salah dengan Dirimu\?/i)).toBeInTheDocument();

    // Check for CTA button
    const ctaButton = screen.getByText(/Temukan Jawabannya \(Gratis\)/i);
    expect(ctaButton).toBeInTheDocument();

    // Click CTA button
    fireEvent.click(ctaButton);
    expect(mockScrollToCalculator).toHaveBeenCalledTimes(1);
  });

  it('renders correctly for logged-in users', () => {
    const userName = 'Budi';
    renderHeroSection(userName);

    // Check for personalized greeting
    expect(screen.getByText(`Selamat Datang Kembali, ${userName}!`)).toBeInTheDocument();

    // Check for "Lihat Chart Saya" button (Link)
    expect(screen.getByText(/Lihat Chart Saya/i)).toBeInTheDocument();

    // Check for "Buat Chart Baru" button
    const newChartButton = screen.getByText(/Buat Chart Baru/i);
    expect(newChartButton).toBeInTheDocument();

    // Click new chart button
    fireEvent.click(newChartButton);
    expect(mockScrollToCalculator).toHaveBeenCalledTimes(1);
  });

  it('displays trust indicator', () => {
    renderHeroSection();
    expect(screen.getByText(/Bergabunglah dengan 230 orang/i)).toBeInTheDocument();
  });
});
