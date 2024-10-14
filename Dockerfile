# Copyright (C) 2024 Enveng Group
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

# Use the official Node.js 18 LTS image from the Docker Hub
FROM node:18

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the application (if using a build tool like Webpack)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Add a health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Run the application as a non-root user for security
RUN useradd --user-group --create-home --shell /bin/false appuser
USER appuser

# Start the application
CMD ["npm", "start"]
