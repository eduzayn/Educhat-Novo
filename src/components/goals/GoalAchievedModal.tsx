import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy,
  Coins,
  Sparkles,
  CheckCircle,
  X
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  type: 'individual' | 'team';
  target: number;
  reward: number;
  period: string;
}

interface GoalAchievedModalProps {
  goal: Goal;
  onClose: () => void;
}

export const GoalAchievedModal = ({ goal, onClose }: GoalAchievedModalProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-close after 8 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    // Hide confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const getTypeIcon = () => {
    return goal.type === 'team' ? '👥' : '👤';
  };

  const getPeriodText = () => {
    switch (goal.period) {
      case 'daily': return 'diária';
      case 'weekly': return 'semanal';
      case 'monthly': return 'mensal';
      default: return 'mensal';
    }
  };

  // Confetti animation styles
  const confettiStyles = Array.from({ length: 50 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${3 + Math.random() * 2}s`,
    backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
  }));

  return (
    <Dialog open={isVisible} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {confettiStyles.map((style, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 animate-bounce"
                style={{
                  ...style,
                  transform: `translateY(-20px) rotate(${Math.random() * 360}deg)`,
                  animation: `confetti-fall ${style.animationDuration} ${style.animationDelay} ease-out infinite`
                }}
              />
            ))}
          </div>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-2 right-2 z-20 hover:bg-white/50"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-8 text-center relative z-10">
          {/* Trophy Icon with Glow */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Trophy className="h-10 w-10 text-white animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-yellow-500 animate-spin" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Meta Conquistada!
            </h2>
            <p className="text-gray-600">Parabéns! Você atingiu sua meta 🎉</p>
          </div>

          {/* Goal Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">{goal.title}</h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Tipo:</span>
                <Badge variant={goal.type === 'team' ? 'default' : 'secondary'}>
                  {getTypeIcon()} {goal.type === 'team' ? 'Equipe' : 'Individual'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Período:</span>
                <span className="capitalize">Meta {getPeriodText()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Objetivo:</span>
                <span className="font-medium">{goal.target}</span>
              </div>
            </div>
          </div>

          {/* Reward */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-lg font-bold text-orange-800">
              <Coins className="h-6 w-6 text-yellow-600 animate-spin" />
              <span>🪙 {goal.reward} moedas conquistadas!</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Suas moedas foram creditadas automaticamente
            </p>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            Continuar Conquistando! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};