import { useState, useCallback } from 'react';
import { Report, SocialPost, Stats } from '../types';

export const useAppData = () => {
  const [reports] = useState<Report[]>([
    {
      id: 1,
      type: 'oil-spill',
      severity: 'high',
      location: 'Bay of Bengal, 15km from Chennai Port',
      description: 'Large oil spill detected affecting approximately 2km of coastline. Immediate response team dispatched. Wildlife rescue operations underway.',
      timestamp: new Date(Date.now() - 3600000),
      verified: true,
      reporter: 'Coast Guard Patrol',
      contact: 'coastguard@marine.gov.in',
      coordinates: [13.0827, 80.2707],
      images: 2
    },
    {
      id: 2,
      type: 'plastic-waste',
      severity: 'medium',
      location: 'Marina Beach, Chennai',
      description: 'Significant plastic debris accumulation after recent monsoon. Beach cleanup operations scheduled. Community volunteers needed.',
      timestamp: new Date(Date.now() - 7200000),
      verified: true,
      reporter: 'Environmental NGO',
      contact: 'cleanup@oceancare.org',
      coordinates: [12.9716, 80.2341],
      images: 5
    },
    {
      id: 3,
      type: 'algae-bloom',
      severity: 'low',
      location: 'Pulicat Lake',
      description: 'Unusual algae bloom detected with water discoloration. Water quality testing in progress. Local fishing temporarily suspended.',
      timestamp: new Date(Date.now() - 10800000),
      verified: false,
      reporter: 'Local Fisherman',
      contact: 'fisher@local.com',
      coordinates: [13.1500, 80.1800],
      images: 1
    },
    {
      id: 4,
      type: 'chemical-pollution',
      severity: 'critical',
      location: 'Ennore Creek',
      description: 'Suspected industrial chemical discharge with fish kill reported. Environmental investigation team deployed. Area cordoned off.',
      timestamp: new Date(Date.now() - 14400000),
      verified: true,
      reporter: 'Environmental Protection Agency',
      contact: 'emergency@epa.gov.in',
      coordinates: [12.8500, 80.3200],
      images: 3
    },
    {
      id: 5,
      type: 'marine-life',
      severity: 'high',
      location: 'Covelong Beach',
      description: 'Mass turtle nesting disruption and unusual marine behavior observed. Marine biologists investigating possible causes.',
      timestamp: new Date(Date.now() - 18000000),
      verified: true,
      reporter: 'Marine Research Institute',
      contact: 'research@marine.ac.in',
      coordinates: [13.2000, 80.1000],
      images: 4
    }
  ]);

  const [socialPosts] = useState<SocialPost[]>([
    {
      id: 1,
      username: 'MarineExplorer_IN',
      content: 'URGENT: Massive oil spill spotted near Chennai port! This is devastating for marine life. Cleanup crews needed immediately! #OceanPollution #SaveOurSeas #ChennaiPort #MarineEmergency',
      timestamp: new Date(Date.now() - 1800000),
      sentiment: 'negative',
      platform: 'twitter',
      engagement: 1247,
      verified: true
    },
    {
      id: 2,
      username: 'EcoWarrior2024',
      content: 'Amazing community spirit at Marina Beach cleanup today! 500+ volunteers collected 2 tons of plastic waste. Together we can heal our oceans 🌊💙 #CleanOcean #CommunityAction #ZeroWaste',
      timestamp: new Date(Date.now() - 3600000),
      sentiment: 'positive',
      platform: 'instagram',
      engagement: 892,
      verified: false
    },
    {
      id: 3,
      username: 'FishermanDaily',
      content: 'Water color changed drastically near Pulicat Lake. Fish behavior very unusual - they seem distressed. Is this climate change effect or something else? Need experts to investigate 🐟',
      timestamp: new Date(Date.now() - 5400000),
      sentiment: 'neutral',
      platform: 'twitter',
      engagement: 234,
      verified: false
    },
    {
      id: 4,
      username: 'CoastalGuardIndia',
      content: 'Regular maritime patrol identified debris field 10km offshore. Monitoring situation closely. Citizens please report any unusual marine sightings to our emergency hotline.',
      timestamp: new Date(Date.now() - 7200000),
      sentiment: 'neutral',
      platform: 'facebook',
      engagement: 567,
      verified: true
    },
    {
      id: 5,
      username: 'OceanConservation',
      content: 'New satellite data reveals alarming increase in Bay of Bengal pollution levels. Microplastics up 40% this year. We need immediate policy action! 📊 #DataScience #OceanHealth #PolicyChange',
      timestamp: new Date(Date.now() - 9000000),
      sentiment: 'negative',
      platform: 'twitter',
      engagement: 1312,
      verified: true
    }
  ]);

  const [stats, setStats] = useState<Stats>({
    totalReports: 247,
    activeHazards: 23,
    verifiedReports: 189,
    socialMentions: 1342,
    activeUsers: 1847,
    coverage: 94
  });

  const updateStats = useCallback(() => {
    setStats(prev => ({
      totalReports: prev.totalReports + Math.floor(Math.random() * 5),
      activeHazards: prev.activeHazards + Math.floor(Math.random() * 3) - 1,
      verifiedReports: prev.verifiedReports + Math.floor(Math.random() * 3),
      socialMentions: prev.socialMentions + Math.floor(Math.random() * 20),
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 10),
      coverage: Math.min(100, prev.coverage + Math.floor(Math.random() * 2))
    }));
  }, []);

  return { reports, socialPosts, stats, updateStats };
};