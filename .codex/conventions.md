## Styling

- Do NOT use styled-components, CSS modules, or inline styles
- Use utility-first Tailwind classes only
- Prefer semantic HTML elements
- All text elements must use `break-keep` by default

## styled component to tailwind

- modify Div component to div element
- modify Flex component to div element has css property {display: 'flex', align-items: 'center'}
- Do not use line style object
- Awalys use tailwind class

### Default Layout Strategy

- Use `display: flex` as the primary layout method for alignment.
- Prefer flexbox over grid unless a true 2D layout is required.
- Do not use CSS Grid for simple alignment.
- Avoid using absolute positioning for alignment.
- Use gap utilities instead of margins between siblings

### Horizontal Alignment

- Use `flex` + `justify-*` utilities for horizontal alignment.

  - `justify-start`
  - `justify-center`
  - `justify-end`
  - `justify-between`
  - `justify-around`
  - `justify-evenly`

  Example:

```tsx
<div className="flex justify-between items-center">
  <span>Left</span>
  <span>Right</span>
</div>
```

## Tailwind Conventions

- Use responsive variants: sm:, md:, lg:, xl:
- Avoid arbitrary values unless absolutely necessary
- Prefer design tokens defined in `tailwind.config.js`

### Icon & Image Source Rules

- Do NOT use raw SVG code copied directly from Figma.
- Do NOT inline SVG markup in JSX/TSX.

### Asset Directory Structure

- assets under the following directory:

```
public/
└─ assets/icons/
    ├─ icon-close.png
    ├─ icon-arrow-right.png
    └─ icon-user.png
```

### Import & Usage Rules

- Import PNG assets and use them via framework image components.
- Do not convert PNG assets back into SVG.

Example (Next.js):

```tsx
import Image from "next/image";

<Image src="/assets/icons/icon-close.png" alt="Close" width={24} height={24} />;
```

## File Structure

- Pages live under `app/`
- Shared UI components under `components/`
- Do not create extra CSS files unless unavoidable

## react-hook-form Rules

- Always use `react-hook-form` for form state management
- Prefer uncontrolled inputs using `register`
- Use `Controller` only when the component cannot be registered directly
- Avoid mixing controlled and uncontrolled inputs in the same form
- Always define form value types using TypeScript generics
- Always provide `defaultValues`
- Do not initialize form values via `useEffect`
- Error messages must be rendered near the corresponding field

Example:

```js
{
  errors.email && (
    <p className="text-red-600 text-sm">{errors.email.message}</p>
  );
}
```

### Form Submission

- Always wrap submit handlers with `handleSubmit`
- Submission logic always has try-catch block
- Do not call APIs directly inside JSX
- Submission logic must be extracted into a function

Example:

```js
   const handleLogin = async (data) => {
    try {
      // api call
    } catch (e) {
      console.log(e);
    }
  };

<form onSubmit={handleSubmit(handleLogin)}>
```

### Form Structure

- Form logic (useForm) must live in the page component
- Presentational input components must receive only necessary props
- Do not call useForm inside reusable UI components

### Controller Usage

Use `Controller` only for:

- Custom UI components
- Third-party components (DatePicker, Select, etc.)
- Components that do not expose ref properly

Do NOT use `Controller` for native inputs.

### register Usage

- Use `register` for native inputs whenever possible
- Validation rules should be defined inline with `register`
- Do not use `onChange` or `value` props with registered inputs

## Axios setting

setting up a production-ready Axios HTTP client for a Next.js project.

Requirements:

- Use Axios
- Create a centralized axios instance
- Base URL should be configurable via environment variables
- Set a default timeout
- Set default headers including User-Agent and Content-Type
- Implement request and response interceptors
- Request interceptor should:
  - Attach common headers
  - Log request URL and method in development mode only
- Response interceptor should:
  - Return response.data by default
  - Normalize error responses into a consistent error object
- Handle network errors, timeout errors, and non-2xx responses
- Export the configured axios instance for reuse
- Use TypeScript
- Follow clean code and maintainable structure
- Assume this will be used for API calls and crawling requests

Output:

- axios instance file (e.g. api/httpClient.ts)
- Include minimal but clear comments
