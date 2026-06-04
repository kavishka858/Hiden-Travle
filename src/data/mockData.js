/** Local images in /public/trails/{id}.jpg — one unique photo per destination */
const trailImage = (id) => `/trails/${id}.jpg`;

export const hiddenTrails = [
  {
    id: 1,
    title: "The Whispering Pines of Paro",
    location: "Paro District, Bhutan",
    description: "A secluded trail through ancient pine forests leading to a hidden monastery untouched by mainstream tourism.",
    tags: ["Eco-friendly", "Culture", "Spiritual"],
    price: "$$$",
    rating: 4.9,
    image: trailImage(1),
    features: ["Local guide", "Homestay included", "Private trail"]
  },
  {
    id: 2,
    title: "Azure Coves of Comino",
    location: "Malta Archipelago",
    description: "Beyond the Blue Lagoon lies a series of limestone caves and crystal-clear inlets accessible only by local fishing boats.",
    tags: ["Coastal", "Adventure", "Hidden Gems"],
    price: "$$",
    rating: 4.8,
    image: trailImage(2),
    features: ["Snorkeling gear", "Traditional boat trip", "Organic picnic"]
  },
  {
    id: 3,
    title: "Rift Valley Echoes",
    location: "Lake Naivasha, Kenya",
    description: "Discover the secret flower farms and community-led conservancies that protect the rare Grevy's zebra.",
    tags: ["Wildlife", "Sustainable", "Community"],
    price: "$$$",
    rating: 4.9,
    image: trailImage(3),
    features: ["Ranger escort", "Eco-lodge stay", "Community donation"]
  },
  {
    id: 4,
    title: "Misty Valleys of Sapa",
    location: "Lao Cai, Vietnam",
    description: "Trek through higher elevation rice terraces far from the usual tourist groups, staying with the Red Dao community.",
    tags: ["Trekking", "Authentic", "Rural"],
    price: "$",
    rating: 4.7,
    image: trailImage(4),
    features: ["Traditional cooking class", "Herbal bath", "Handicraft workshop"]
  },
  {
    id: 5,
    title: "Fjord Silence Trail",
    location: "Western Fjords, Iceland",
    description: "Walk cliffside paths above turquoise fjords where only a handful of local hikers go each season.",
    tags: ["Trekking", "Eco-friendly", "Hidden Gems"],
    price: "$$$",
    rating: 4.8,
    image: trailImage(5),
    features: ["Glacier guide", "Hot spring soak", "Farm-to-table meals"]
  },
  {
    id: 6,
    title: "Desert Star Camp",
    location: "Wadi Rum, Jordan",
    description: "Sleep under the Milky Way in a Bedouin-led camp, exploring sandstone arches far from the main tourist routes.",
    tags: ["Adventure", "Culture", "Spiritual"],
    price: "$$",
    rating: 4.9,
    image: trailImage(6),
    features: ["Camel trek", "Stargazing night", "Traditional feast"]
  },
  {
    id: 7,
    title: "Atlantic Edge Walk",
    location: "Sagres, Portugal",
    description: "Follow wind-carved cliffs and secret coves on the southwestern tip of Europe, guided by fishermen who know every tide.",
    tags: ["Coastal", "Sustainable", "Hidden Gems"],
    price: "$$",
    rating: 4.7,
    image: trailImage(7),
    features: ["Surf lesson", "Seafood lunch", "Lighthouse visit"]
  },
  {
    id: 8,
    title: "Cloud Forest Canopy",
    location: "Monteverde, Costa Rica",
    description: "Explore misty hanging bridges and rare quetzal habitats with a conservation group restoring native cloud forest.",
    tags: ["Wildlife", "Eco-friendly", "Sustainable"],
    price: "$$$",
    rating: 4.8,
    image: trailImage(8),
    features: ["Canopy walk", "Bird spotting", "Reforestation tour"]
  },
  {
    id: 9,
    title: "Sacred Valley Footpaths",
    location: "Cusco Region, Peru",
    description: "Hike Inca-era terraces and village trails that bypass crowded ruins, led by Quechua families sharing their stories.",
    tags: ["Culture", "Trekking", "Community"],
    price: "$$",
    rating: 4.9,
    image: trailImage(9),
    features: ["Village homestay", "Weaving demo", "Mountain picnic"]
  },
  {
    id: 10,
    title: "Silent Backwaters",
    location: "Alleppey, India",
    description: "Drift through narrow canals on a small houseboat, stopping at family farms and temples tourists rarely reach.",
    tags: ["Eco-friendly", "Culture", "Rural"],
    price: "$",
    rating: 4.6,
    image: trailImage(10),
    features: ["Canoe excursion", "Spice garden tour", "Local chef meal"]
  },
  {
    id: 11,
    title: "Alpine Lake Circuit",
    location: "Dolomites, Italy",
    description: "A multi-day hut-to-hut route linking emerald lakes and wildflower meadows without the busy resort crowds.",
    tags: ["Trekking", "Adventure", "Hidden Gems"],
    price: "$$$$",
    rating: 5.0,
    image: trailImage(11),
    features: ["Mountain refuge", "Via ferrata option", "Local wine tasting"]
  },
  {
    id: 12,
    title: "Island Reef Sanctuary",
    location: "Palawan, Philippines",
    description: "Snorkel protected reefs and mangrove channels with community rangers who limit daily visitors to preserve marine life.",
    tags: ["Coastal", "Wildlife", "Sustainable"],
    price: "$$",
    rating: 4.8,
    image: trailImage(12),
    features: ["Reef patrol", "Island camping", "Zero-waste kit"]
  }
];

export const tripTypes = ["Relaxation", "Adventure", "Cultural Immersion", "Wildlife Safari", "Coastal Escape"];
export const budgetLevels = ["$", "$$", "$$$", "$$$$"];

export const travelBuddies = [
  {
    id: 1,
    name: "Maya Chen",
    destination: "Paro, Bhutan",
    dates: "Mar 12 – Mar 22, 2026",
    style: ["Trekking", "Culture", "Eco-friendly"],
    bio: "Slow-travel photographer looking for a hiking partner on monastery trails.",
    match: 92,
    trips: 14,
    avatar: "MC"
  },
  {
    id: 2,
    name: "James Okonkwo",
    destination: "Lake Naivasha, Kenya",
    dates: "Apr 3 – Apr 10, 2026",
    style: ["Wildlife", "Sustainable", "Community"],
    bio: "Wildlife enthusiast — happy to split ranger fees and share a conservancy stay.",
    match: 88,
    trips: 9,
    avatar: "JO"
  },
  {
    id: 3,
    name: "Sofia Ruiz",
    destination: "Sagres, Portugal",
    dates: "May 1 – May 8, 2026",
    style: ["Coastal", "Adventure", "Hidden Gems"],
    bio: "Surf beginner seeking a buddy for cliff walks and local seafood spots.",
    match: 85,
    trips: 6,
    avatar: "SR"
  },
  {
    id: 4,
    name: "Arjun Patel",
    destination: "Alleppey, India",
    dates: "Jun 5 – Jun 12, 2026",
    style: ["Eco-friendly", "Rural", "Culture"],
    bio: "Want to do a small houseboat route and village homestays off the main canal.",
    match: 90,
    trips: 11,
    avatar: "AP"
  },
  {
    id: 5,
    name: "Elena Kowalski",
    destination: "Dolomites, Italy",
    dates: "Jul 14 – Jul 21, 2026",
    style: ["Trekking", "Adventure", "Photography"],
    bio: "Experienced hiker planning hut-to-hut — looking for someone with similar pace.",
    match: 87,
    trips: 22,
    avatar: "EK"
  },
  {
    id: 6,
    name: "Noah Williams",
    destination: "Wadi Rum, Jordan",
    dates: "Aug 2 – Aug 7, 2026",
    style: ["Adventure", "Culture", "Spiritual"],
    bio: "Night-sky nerd. Interested in Bedouin camp stays and early-morning desert treks.",
    match: 83,
    trips: 5,
    avatar: "NW"
  },
  {
    id: 7,
    name: "Yuki Tanaka",
    destination: "Sapa, Vietnam",
    dates: "Sep 10 – Sep 18, 2026",
    style: ["Trekking", "Authentic", "Rural"],
    bio: "First time in Vietnam — would love a buddy for terrace hikes and homestay cooking.",
    match: 91,
    trips: 8,
    avatar: "YT"
  },
  {
    id: 8,
    name: "Amara Diallo",
    destination: "Palawan, Philippines",
    dates: "Oct 4 – Oct 12, 2026",
    style: ["Coastal", "Wildlife", "Sustainable"],
    bio: "Snorkeler focused on reef-safe travel. Splitting boat to a less-visited island.",
    match: 86,
    trips: 7,
    avatar: "AD"
  }
];
