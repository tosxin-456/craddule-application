// src/data/phases.js
import {
    faLightbulb,
    faClipboardList,
    faPencilRuler,
    faFlaskVial,
    faRocket
} from '@fortawesome/free-solid-svg-icons';

export const phases = [
    {
        title: 'IDEATION',
        subtitle: 'Generate & Explore Ideas',
        icon: faLightbulb,
        content: 'We help you spark fresh ideas through creative brainstorming, market insight, and trend analysis. This is where we uncover real problems worth solving, validate pain points, and explore innovative possibilities to shape your vision.'
    },
    {
        title: 'PRODUCT DEFINITION',
        subtitle: 'Define Goals & Requirements',
        icon: faClipboardList,
        content: 'We work with you to turn your ideas into a focused, actionable plan. Define your product’s purpose, key features, user personas, and success metrics. This phase aligns everyone around a clear strategy to guide development.'
    },
    {
        title: 'INITIAL DESIGN',
        subtitle: 'Create Prototypes & Models',
        icon: faPencilRuler,
        content: 'Transform concepts into tangible forms through sketches, wireframes, and interactive prototypes. We help you visualize the user experience, map out core flows, and prepare early designs for user feedback and iteration.'
    },
    {
        title: 'VALIDATION & TESTING',
        subtitle: 'Test & Refine',
        icon: faFlaskVial,
        content: 'Put your prototypes in front of real users to test assumptions, identify pain points, and validate usability. We refine your product based on actionable insights, ensuring it’s intuitive, functional, and aligned with user needs.'
    },
    {
        title: 'COMMERCIALIZATION',
        subtitle: 'Launch & Scale',
        icon: faRocket,
        content: 'Prepare your product for a successful launch with go-to-market strategy, branding, growth tools, and analytics. We support you in gaining traction, acquiring users, and building the foundation to scale sustainably.'
    }
];
