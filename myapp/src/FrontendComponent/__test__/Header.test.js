import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {BrowserRouter as Router} from 'react-router-dom';
import Header from '../Header';
 // Update the path accordingly

describe('Header Component', () => {
  test('renders with the correct title', () => {
    const title = 'Test Title';
    render(<Header title={title} />);

    // Check if the component renders with the correct title
    expect(screen.getByText(`🐼${title}`)).toBeInTheDocument();
  });
});
