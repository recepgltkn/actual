import type { ComponentType, SVGProps } from 'react';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { radius, spacing } from '@actual-app/components/tokens';
import { View } from '@actual-app/components/view';

import { ContourTrace } from '#components/ContourTrace';
import { Link } from '#components/common/Link';

type NavRowProps = {
  title: string;
  Icon:
    | ComponentType<SVGProps<SVGElement>>
    | ComponentType<SVGProps<SVGSVGElement>>;
  to: string;
};

export function NavRow({ title, Icon, to }: NavRowProps) {
  return (
    <View style={{ flexShrink: 0 }}>
      <Link
        variant="internal"
        to={to}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          padding: spacing.sm,
          borderRadius: radius.sm,
          marginBottom: 1,
          fontSize: 13,
          fontWeight: 500,
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden',
          color: theme.sidebarItemText,
          ':hover': { backgroundColor: theme.sidebarItemBackgroundHover },
          '&[aria-current="page"] .sidebar-contour-trace': {
            opacity: 0.3,
          },
        }}
        activeStyle={{
          backgroundColor: theme.sidebarItemBackgroundSelected,
          color: theme.sidebarItemTextSelected,
          fontWeight: 600,
        }}
      >
        <Icon width={15} height={15} style={{ flexShrink: 0 }} />
        <Text style={styles.ellipsisText}>{title}</Text>
        <ContourTrace
          className="sidebar-contour-trace"
          style={{
            position: 'absolute',
            right: 6,
            top: 0,
            width: 78,
            height: '100%',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
      </Link>
    </View>
  );
}
