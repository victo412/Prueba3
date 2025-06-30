import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { OnboardingData } from '../components/Onboarding/OnboardingFlow';

export function useOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, markOnboardingComplete } = useAuth();

  // Determine if user has completed onboarding
  // Primary check: has_onboarded field
  // Fallback check: onboarding_data exists
  const hasCompletedOnboarding = user?.hasOnboarded === true || !!user?.onboardingData;

  console.log('🎯 Onboarding status check:', {
    userEmail: user?.email,
    hasOnboarded: user?.hasOnboarded,
    hasOnboardingData: !!user?.onboardingData,
    hasCompletedOnboarding
  });

  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) {
      console.error('❌ No user available to save onboarding data');
      throw new Error('Usuario no disponible');
    }

    setIsLoading(true);

    try {
      console.log('🎉 Completing onboarding for user:', user.id);
      
      // Use the markOnboardingComplete function from useAuth
      await markOnboardingComplete(user.id, data);

      // Generate initial schedule based on onboarding data
      await generateInitialSchedule(data);

      console.log('✅ Onboarding completed successfully');

    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateInitialSchedule = async (data: OnboardingData) => {
    if (!user) return;

    try {
      console.log('📅 Generating initial schedule for user:', user.id);
      
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      // Create wake up and sleep blocks
      const wakeUpBlock = {
        user_id: user.id,
        name: '¡Despierta!',
        start_time: `${todayString}T${data.wakeUpTime}:00`,
        duration_minutes: 30,
        tier: 1,
        color: '#10B981', // green
        icon: '☀️',
      };

      const sleepBlock = {
        user_id: user.id,
        name: '¡A dormir!',
        start_time: `${todayString}T${data.sleepTime}:00`,
        duration_minutes: 30,
        tier: 1,
        color: '#6366F1', // indigo
        icon: '🌙',
      };

      // Insert blocks
      const { error: blocksError } = await supabase
        .from('blocks')
        .insert([wakeUpBlock, sleepBlock]);

      if (blocksError) {
        console.error('❌ Error creating initial blocks:', blocksError);
      } else {
        console.log('✅ Initial blocks created successfully');
      }

      // Create habit reminders as events
      const habitEvents = data.habits.map(habit => ({
        user_id: user.id,
        title: `Hábito: ${habit.name}`,
        start_time: getHabitTime(data, habit),
        end_time: getHabitEndTime(data, habit),
        all_day: false,
        source: 'onboarding_habit',
      }));

      if (habitEvents.length > 0) {
        const { error: eventsError } = await supabase
          .from('events')
          .insert(habitEvents);

        if (eventsError) {
          console.error('❌ Error creating habit events:', eventsError);
        } else {
          console.log('✅ Habit events created successfully');
        }
      }

      console.log('🎉 Initial schedule generated successfully');

    } catch (error) {
      console.error('❌ Error generating initial schedule:', error);
    }
  };

  const resetOnboarding = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      console.log('🔄 Resetting onboarding for user:', user.id);
      
      // Clear onboarding data from Supabase
      const { error } = await supabase
        .from('users')
        .update({ 
          onboarding_data: null,
          has_onboarded: false 
        })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Error clearing onboarding data from Supabase:', error);
        throw error;
      }

      console.log('✅ Onboarding data cleared from Supabase');

    } catch (error) {
      console.error('❌ Error resetting onboarding:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hasCompletedOnboarding,
    onboardingData: user?.onboardingData,
    completeOnboarding,
    resetOnboarding,
    isLoading,
  };
}

// Helper function to determine optimal time for habits based on user preferences
function getHabitTime(data: OnboardingData, habit: any): string {
  const today = new Date().toISOString().split('T')[0];
  
  // Default times based on habit category and user's energy peak
  let defaultHour = 9; // fallback

  switch (habit.category) {
    case 'health':
      // Health habits work well in the morning or based on energy peak
      if (data.energyPeak === 'morning') defaultHour = 7;
      else if (data.energyPeak === 'evening') defaultHour = 18;
      else defaultHour = 8;
      break;
    
    case 'learning':
      // Learning habits during peak energy times
      if (data.energyPeak === 'morning') defaultHour = 9;
      else if (data.energyPeak === 'afternoon') defaultHour = 14;
      else if (data.energyPeak === 'evening') defaultHour = 19;
      else defaultHour = 21;
      break;
    
    case 'work':
      // Work habits during traditional work hours
      if (data.energyPeak === 'morning') defaultHour = 8;
      else defaultHour = 10;
      break;
    
    case 'personal':
      // Personal habits in the evening
      defaultHour = 20;
      break;
  }

  return `${today}T${defaultHour.toString().padStart(2, '0')}:00:00`;
}

function getHabitEndTime(data: OnboardingData, habit: any): string {
  const startTime = new Date(getHabitTime(data, habit));
  const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes later
  return endTime.toISOString();
}