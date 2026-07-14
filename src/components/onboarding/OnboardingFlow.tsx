/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../../types';

import SplashStep from './SplashStep';
import WelcomeStep from './WelcomeStep';
import LoginStep from './LoginStep';
import ProfileStep from './ProfileStep';
import AISetupStep from './AISetupStep';
import PermissionsStep from './PermissionsStep';

interface OnboardingFlowProps {
  profile: UserProfile;
  onRefreshDB: () => void;
}

type StepType = 'splash' | 'welcome' | 'login' | 'profile' | 'aiSetup' | 'permissions';

export default function OnboardingFlow({ profile, onRefreshDB }: OnboardingFlowProps) {
  const [step, setStep] = useState<StepType>((profile?.onboardingStep as StepType) || 'splash');
  const [firstName, setFirstName] = useState<string>(profile?.name || '');

  // Keep in sync with server profile step in progress
  useEffect(() => {
    if (profile?.onboardingStep && profile.onboardingStep !== step) {
      setStep(profile.onboardingStep as StepType);
    }
    if (profile?.name) {
      setFirstName(profile.name);
    }
  }, [profile]);

  const updateServerProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/db/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        onRefreshDB();
      }
    } catch (error) {
      console.error('Failed to sync onboarding progress to server:', error);
    }
  };

  const handleSplashNext = () => {
    const nextStep = 'welcome';
    setStep(nextStep);
    updateServerProfile({ onboardingStep: nextStep });
  };

  const handleWelcomeNext = () => {
    const nextStep = 'login';
    setStep(nextStep);
    updateServerProfile({ onboardingStep: nextStep });
  };

  const handleWelcomeSkip = () => {
    const nextStep = 'login';
    setStep(nextStep);
    updateServerProfile({ onboardingStep: nextStep });
  };

  const handleLoginSuccess = (userData: { name: string; authMethod: string }) => {
    // If we have signed in, set onboarding step to basic profile
    const nextStep = 'profile';
    setStep(nextStep);
    setFirstName(userData.name);
    updateServerProfile({
      name: userData.name,
      onboardingStep: nextStep,
    });
  };

  const handleProfileSave = (data: {
    name: string;
    age: number;
    gender: string;
    height: number;
    heightUnit: 'cm' | 'ft';
    weight: number;
    weightUnit: 'kg' | 'lb';
    bloodGroup: string;
  }) => {
    const nextStep = 'aiSetup';
    setFirstName(data.name);
    setStep(nextStep);
    updateServerProfile({
      ...data,
      onboardingStep: nextStep,
    });
  };

  const handleAISetupPartialSave = (answers: {
    conditions?: string[];
    allergies?: string;
    takingMedicines?: boolean;
    medicineNames?: string;
    mainGoal?: string;
  }) => {
    // Merge answers into profile.onboardingAnswers
    const existingAnswers = profile?.onboardingAnswers || {};
    const updatedAnswers = { ...existingAnswers, ...answers };

    updateServerProfile({
      onboardingAnswers: updatedAnswers,
    });
  };

  const handleAISetupComplete = () => {
    const nextStep = 'permissions';
    setStep(nextStep);
    updateServerProfile({ onboardingStep: nextStep });
  };

  const handlePermissionSave = (permId: string, allowed: boolean) => {
    const existingPermissions = profile?.permissions || {};
    const updatedPermissions = { ...existingPermissions, [permId]: allowed };

    updateServerProfile({
      permissions: updatedPermissions,
    });
  };

  const handlePermissionsComplete = () => {
    // Onboarding fully complete! Route to dashboard
    updateServerProfile({
      onboardingComplete: true,
      onboardingStep: undefined,
    });
  };

  // Switch renderer with Slide layout
  const renderStepContent = () => {
    switch (step) {
      case 'splash':
        return <SplashStep onNext={handleSplashNext} />;
      case 'welcome':
        return <WelcomeStep onNext={handleWelcomeNext} onSkip={handleWelcomeSkip} />;
      case 'login':
        return <LoginStep onSuccess={handleLoginSuccess} />;
      case 'profile':
        return <ProfileStep initialName={firstName} onSave={handleProfileSave} />;
      case 'aiSetup':
        return (
          <AISetupStep
            firstName={firstName}
            onPartialSave={handleAISetupPartialSave}
            onComplete={handleAISetupComplete}
          />
        );
      case 'permissions':
        return (
          <PermissionsStep
            onSavePermission={handlePermissionSave}
            onComplete={handlePermissionsComplete}
          />
        );
      default:
        return <SplashStep onNext={handleSplashNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
