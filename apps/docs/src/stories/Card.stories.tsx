import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card } from '@virtuui/react';
const meta = { title: 'Data display/Card', component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: () => <Card><h3>A space for your ideas</h3><p>Something great starts here.</p><Button>Create project</Button></Card> };
