'use client';

import { useState, useEffect } from 'react';
import { getTimeRemaining } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  endTime: Date | string;
  onExpire?: () => void;
  className?: string;
  showDays?: boolean;
}

export default function CountdownTimer({
  endTime,
  onExpire,
  className,
  showDays = false
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endTime);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (timeLeft.total <= 0) {
    return <span className="text-error font-medium">Đã kết thúc</span>;
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="bg-gray-900 text-white px-2 py-1 rounded text-lg font-bold min-w-[40px] text-center">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {showDays && timeLeft.days > 0 && (
        <>
          <TimeBlock value={timeLeft.days} label="Ngày" />
          <span className="text-xl font-bold text-gray-400">:</span>
        </>
      )}
      <TimeBlock value={timeLeft.hours} label="Giờ" />
      <span className="text-xl font-bold text-gray-400">:</span>
      <TimeBlock value={timeLeft.minutes} label="Phút" />
      <span className="text-xl font-bold text-gray-400">:</span>
      <TimeBlock value={timeLeft.seconds} label="Giây" />
    </div>
  );
}

// Compact version for product cards
export function CountdownTimerCompact({
  endTime,
  className
}: {
  endTime: Date | string;
  className?: string;
}) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.total <= 0) {
    return null;
  }

  const formatTime = () => {
    const parts = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    parts.push(
      `${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes
        .toString()
        .padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`
    );
    return parts.join(' ');
  };

  return (
    <span className={cn('text-sm font-medium text-error', className)}>
      ⏰ {formatTime()}
    </span>
  );
}
