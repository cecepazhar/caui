import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import ProGate from './ProGate.svelte';
import ProBadge from './ProBadge.svelte';
import { createLicenseClient } from '../../license/client.svelte';
import { createEntitlements } from '../../license/entitlements.svelte';
import { memoryStorage } from '../../license/storage';
import { setLocale } from '../../i18n.svelte';

const secret = createRawSnippet(() => ({ render: () => '<p>secret-pro-content</p>' }));

function freeEntitlements() {
  const client = createLicenseClient({ productCode: 'CATERM', publicKey: new Uint8Array(32), storage: memoryStorage() });
  return createEntitlements(client, { 'caterm.split': 'pro' });
}

describe('ProGate', () => {
  it('renders children when unlocked', () => {
    render(ProGate, { children: secret });
    expect(screen.getByText('secret-pro-content')).toBeInTheDocument();
  });

  it('hides children and shows localized prompt when locked', () => {
    setLocale('id');
    render(ProGate, { children: secret, locked: true, featureName: 'Split SFTP', onUpgrade: () => {} });
    expect(screen.queryByText('secret-pro-content')).toBeNull();
    expect(screen.getByText('Split SFTP adalah fitur Pro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upgrade ke Pro' })).toBeInTheDocument();
    setLocale('en');
  });

  it('uses entitlements over the manual locked flag (Free user cannot unlock by prop)', () => {
    render(ProGate, { children: secret, locked: false, feature: 'caterm.split', entitlements: freeEntitlements() });
    expect(screen.queryByText('secret-pro-content')).toBeNull();
  });

  it('free features stay open with entitlements', () => {
    render(ProGate, { children: secret, feature: 'caterm.basic', entitlements: freeEntitlements() });
    expect(screen.getByText('secret-pro-content')).toBeInTheDocument();
  });

  it('omits the upgrade button when no onUpgrade handler is provided', () => {
    render(ProGate, { children: secret, locked: true });
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('uses design tokens only (no hard-coded hex)', () => {
    const { container } = render(ProGate, { children: secret, locked: true, onUpgrade: () => {} });
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
});

describe('ProBadge', () => {
  it('renders tier label', () => {
    render(ProBadge, { tier: 'team' });
    expect(screen.getByText('Team')).toBeInTheDocument();
  });
});
