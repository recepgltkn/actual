import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

import { theme } from './theme';
import { View } from './View';

type CardProps = ComponentProps<typeof View>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    return (
      <View
        {...props}
        ref={ref}
        style={{
          marginTop: 12,
          marginLeft: 0,
          marginRight: 0,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: 12,
          backgroundColor: theme.cardBackground,
          boxShadow: 'none',
          ...props.style,
        }}
      >
        <View
          style={{
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {children}
        </View>
      </View>
    );
  },
);

Card.displayName = 'Card';
