# Руководство по стилизации приложения

## 🎨 Обзор

Приложение использует современную систему дизайна с MUI компонентами, интегрированными с существующими CSS переменными. Все интерфейсы стилизованы согласно последним трендам UI/UX.

## 🏗️ Архитектура стилей

### MUI Theme Integration
- Настроена кастомная MUI тема в `src/shared/ui/theme/muiTheme.ts`
- Интеграция с CSS переменными для консистентности
- Автоматическое переключение между светлой и темной темой

### CSS Variables
- Централизованные переменные в `src/shared/styles/variables.css`
- Поддержка темной и светлой тем
- Responsive значения для разных экранов

## 🎭 Компоненты анимации

### AnimatedContainer
```tsx
import { AnimatedContainer } from '@/shared/ui';

<AnimatedContainer 
  animation="fade"
  delay={200}
  duration={300}
>
  <YourComponent />
</AnimatedContainer>
```

### PulseAnimation
```tsx
import { PulseAnimation } from '@/shared/ui';

<PulseAnimation type="glow" duration={2000}>
  <Button>Animated Button</Button>
</PulseAnimation>
```

### LoadingSkeleton
```tsx
import { LoadingSkeleton } from '@/shared/ui';

<LoadingSkeleton variant="card" />
<LoadingSkeleton variant="list" lines={3} />
<LoadingSkeleton variant="message" lines={5} />
```

## 📱 Responsive Design

### Breakpoints Hooks
```tsx
import { useBreakpoints, useResponsiveValue } from '@/shared/hooks';

const { isPhone, isTablet, isDesktop } = useBreakpoints();
const padding = useResponsiveValue({
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px'
}, '16px');
```

### Responsive CSS Classes
```css
.container-responsive  /* Адаптивный контейнер */
.grid-responsive      /* Адаптивная сетка */
.flex-responsive      /* Адаптивный flex */
.button-responsive    /* Touch-friendly кнопки */
.hide-mobile         /* Скрыть на мобильных */
.show-mobile         /* Показать только на мобильных */
```

## ♿ Accessibility

### Focus Management
```tsx
import { useFocusManagement, useFocusTrap } from '@/shared/hooks';

const { setFocus, restoreFocus } = useFocusManagement();
const trapRef = useFocusTrap(isModalOpen);
```

### Screen Reader Support
```tsx
import { useScreenReaderAnnouncement } from '@/shared/hooks';

const announce = useScreenReaderAnnouncement();
announce('Game started!');
```

### ARIA Descriptions
```tsx
import { useAriaDescribedBy } from '@/shared/hooks';

const ariaProps = useAriaDescribedBy('This button starts the game');
<Button {...ariaProps}>Start Game</Button>
```

## 🎯 Основные улучшения

### Страница авторизации
- Современный glassmorphism дизайн
- Анимированные элементы
- Адаптивная верстка
- Улучшенная типографика

### Домашняя страница
- Интерактивные карточки с hover эффектами
- Градиентные фоны
- Микроанимации
- Responsive grid layout

### Игровая страница
- Улучшенный мессенджер с аватарами
- Визуальные индикаторы раундов
- Анимированные переходы состояний
- Touch-friendly интерфейс

### Компоненты игры
- Стилизованные сообщения с типизацией
- Анимированные раунды
- Улучшенные формы ввода
- Responsive дизайн чата

## 🔧 Лучшие практики

### Использование MUI Theme
```tsx
import { useTheme } from '@mui/material/styles';

const theme = useTheme();
// Используйте theme.palette, theme.spacing, etc.
```

### CSS Variables
```tsx
// В sx prop MUI компонентов
sx={{
  color: 'var(--text-primary)',
  backgroundColor: 'var(--bg-elevated)',
  borderRadius: 'var(--radius-lg)',
}}
```

### Анимации
- Используйте `useReducedMotion` для респекта пользовательских предпочтений
- Анимации должны быть subtle и не отвлекающими
- Длительность: 150-300ms для микроанимаций, 300-600ms для переходов

### Адаптивность
- Mobile-first подход
- Минимальная высота 44px для touch элементов
- Тестирование на различных устройствах
- Поддержка landscape ориентации

### Доступность
- Семантическая разметка
- Поддержка клавиатурной навигации
- ARIA атрибуты
- Контрастность цветов
- Screen reader поддержка

## 🎨 Цветовая палитра

### Primary Colors
- `--primary-500`: #0ea5e9 (основной)
- `--primary-600`: #0284c7 (темнее)
- `--primary-100`: #e0f2fe (светлее)

### Secondary Colors
- `--secondary-500`: #eab308 (основной)
- `--accent-500`: #22c55e (акцент)

### Semantic Colors
- `--success-500`: #22c55e
- `--error-500`: #ef4444
- `--warning-500`: #f59e0b
- `--info-500`: #3b82f6

## 📦 Структура файлов

```
src/shared/
├── ui/
│   ├── theme/           # MUI тема
│   ├── animations/      # Компоненты анимаций
│   └── index.ts
├── hooks/
│   ├── useBreakpoints.ts    # Responsive хуки
│   ├── useAccessibility.ts  # A11y хуки
│   └── index.ts
└── styles/
    ├── variables.css    # CSS переменные
    ├── global.css      # Глобальные стили
    ├── responsive.css  # Responsive утилиты
    └── reset.css       # CSS reset
```

## 🚀 Производительность

- Все анимации оптимизированы для GPU
- Lazy loading для тяжелых компонентов
- CSS-in-JS оптимизация с MUI
- Minimal bundle size impact
- Tree-shaking поддержка

## 🎯 Следующие шаги

1. Добавить больше микроанимаций
2. Улучшить темную тему
3. Добавить sound эффекты
4. Реализовать haptic feedback
5. Добавить больше responsive утилит
