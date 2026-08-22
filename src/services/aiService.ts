import { AIDraftSuggestion, Memory, MemoryCategory, Person } from '../types';

export class AIService {
  /**
   * Generates a concise emotional AI memory summary based on place, date, story, people, tags.
   */
  static async generateSummary(params: {
    title: string;
    story: string;
    placeName: string;
    city: string;
    date: string;
    peopleNames: string[];
    tags: string[];
  }): Promise<string> {
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.summary) return json.summary;
      }
    } catch (e) {
      console.warn('Backend AI summary fetch failed, utilizing intelligent smart fallback:', e);
    }

    // High quality deterministic smart fallback
    return this.fallbackGenerateSummary(params);
  }

  /**
   * Intelligent auto-organizer that infers Category, Tags, Mood, People, Collection & Emotional Summary.
   */
  static async organizeWithAI(params: {
    title: string;
    story: string;
    placeName?: string;
    city?: string;
    date?: string;
    existingPeople: Person[];
  }): Promise<AIDraftSuggestion> {
    try {
      const res = await fetch('/api/ai/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.suggestion) return json.suggestion;
      }
    } catch (e) {
      console.warn('Backend AI organize fetch failed, utilizing intelligent smart fallback:', e);
    }

    return this.fallbackOrganize(params);
  }

  private static fallbackGenerateSummary(params: {
    title: string;
    story: string;
    placeName: string;
    city: string;
    date: string;
    peopleNames: string[];
    tags: string[];
  }): string {
    const { title, story, city, placeName, peopleNames, tags } = params;
    const loc = city || placeName || 'this special place';
    const companions =
      peopleNames.length > 0
        ? `together with ${peopleNames.slice(0, 2).join(' and ')}`
        : 'in quiet reflection';

    const text = (title + ' ' + story).toLowerCase();

    if (text.includes('hackathon') || text.includes('code') || text.includes('tech') || text.includes('demo')) {
      return `An exhilarating tech milestone in ${loc} ${companions}, where intense creative building and perseverance crystallized into an unforgettable accomplishment.`;
    }
    if (text.includes('beach') || text.includes('sea') || text.includes('sunset') || text.includes('ocean')) {
      return `A sun-kissed coastal escape in ${loc} ${companions}, framed by gentle waves, golden evening hues, and carefree serenity.`;
    }
    if (text.includes('trek') || text.includes('hike') || text.includes('mountain') || text.includes('fort') || text.includes('fog')) {
      return `A refreshing adventure across the rugged slopes of ${loc} ${companions}, discovering stunning vistas and raw natural beauty.`;
    }
    if (text.includes('cafe') || text.includes('chai') || text.includes('dinner') || text.includes('food') || text.includes('feast')) {
      return `A delightful culinary celebration in ${loc} ${companions}, sharing deep stories and authentic local flavors late into the night.`;
    }
    if (text.includes('heritage') || text.includes('historic') || text.includes('tomb') || text.includes('monument')) {
      return `A timeless cultural stroll through the storied arches of ${loc} ${companions}, honoring history and lasting memories.`;
    }

    return `A cherished chapter in ${loc} ${companions}, capturing the spirit of ${tags.slice(0, 2).join(' & ') || 'meaningful moments'} and genuine connection.`;
  }

  private static fallbackOrganize(params: {
    title: string;
    story: string;
    placeName?: string;
    city?: string;
    date?: string;
    existingPeople: Person[];
  }): AIDraftSuggestion {
    const combined = `${params.title} ${params.story} ${params.placeName || ''} ${params.city || ''}`.toLowerCase();

    let category: MemoryCategory = 'Travel';
    let mood = 'Joyful & Nostalgic';
    let collectionName = 'Travel & Roadtrips';
    const tags: string[] = [];
    const matchedPeople: string[] = [];

    // Category & Mood detection
    if (combined.includes('college') || combined.includes('campus') || combined.includes('exam') || combined.includes('orientation') || combined.includes('hostel')) {
      category = 'College';
      mood = 'Nostalgic & Enthusiastic';
      collectionName = 'College Life';
      tags.push('College', 'Campus', 'StudentLife');
    } else if (combined.includes('hackathon') || combined.includes('code') || combined.includes('dev') || combined.includes('work') || combined.includes('conference') || combined.includes('project')) {
      category = 'Work';
      mood = 'Focused & Accomplished';
      collectionName = 'Tech & Hackathons';
      tags.push('Tech', 'Innovation', 'Building', 'Milestone');
    } else if (combined.includes('family') || combined.includes('cousin') || combined.includes('mom') || combined.includes('dad') || combined.includes('wedding')) {
      category = 'Family';
      mood = 'Warm & Heartfelt';
      collectionName = 'Family Heritage';
      tags.push('Family', 'Reunion', 'Heritage');
    } else if (combined.includes('food') || combined.includes('chai') || combined.includes('dinner') || combined.includes('cafe') || combined.includes('saoji') || combined.includes('restaurant')) {
      category = 'Food';
      mood = 'Delightful & Cozy';
      collectionName = 'Friends & Nights Out';
      tags.push('Foodie', 'LocalFlavors', 'NightOut');
    } else if (combined.includes('friend') || combined.includes('party') || combined.includes('night drive') || combined.includes('marine drive')) {
      category = 'Friends';
      mood = 'Free-spirited & Euphoric';
      collectionName = 'Friends & Nights Out';
      tags.push('Friendship', 'GoodTimes', 'Memories');
    } else {
      category = 'Travel';
      mood = 'Adventurous & Serene';
      collectionName = 'Travel & Roadtrips';
      tags.push('Exploration', 'Wanderlust', 'Scenic');
    }

    if (params.city) {
      tags.push(params.city);
    }

    // Match people mentioned in text
    params.existingPeople.forEach((p) => {
      const firstName = p.name.split(' ')[0].toLowerCase();
      if (combined.includes(firstName) || combined.includes(p.name.toLowerCase())) {
        matchedPeople.push(p.name);
      }
    });

    const summary = this.fallbackGenerateSummary({
      title: params.title || 'Untitled Memory',
      story: params.story || 'A special moment.',
      placeName: params.placeName || '',
      city: params.city || '',
      date: params.date || new Date().toISOString().split('T')[0],
      peopleNames: matchedPeople,
      tags: Array.from(new Set(tags)),
    });

    return {
      category,
      tags: Array.from(new Set(tags)),
      peopleNames: matchedPeople,
      collectionName,
      aiSummary: summary,
      mood,
      suggestedTitle: params.title || `Memories in ${params.city || 'Special Place'}`,
    };
  }
}
