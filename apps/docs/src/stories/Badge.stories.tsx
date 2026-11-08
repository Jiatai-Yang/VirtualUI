import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@virtuui/react';
const meta = { title: 'Data display/Badge', component: Badge, args: { children: 'Published', dot: true, variant: 'success' } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Success: Story = {};
export const Neutral: Story = { args: { variant: 'neutral', children: 'Draft' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Needs review' } };
