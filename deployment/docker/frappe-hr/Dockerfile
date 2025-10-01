# Frappe HR Dockerfile
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FRAPPE_USER=frappe
ENV BENCH_USER=frappe

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    nodejs \
    npm \
    redis-server \
    postgresql-client \
    build-essential \
    libffi-dev \
    libssl-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js for Frappe frontend assets
RUN npm install -g yarn

# Install Frappe Bench
RUN pip install frappe-bench

# Create frappe user
RUN useradd --create-home --shell /bin/bash $FRAPPE_USER

# Set working directory
WORKDIR /home/$FRAPPE_USER

# Initialize Frappe Bench for HR
RUN bench init --frappe-branch main hr-bench

# Set ownership and switch to frappe user
RUN chown -R $FRAPPE_USER:$FRAPPE_USER /home/$FRAPPE_USER
USER $FRAPPE_USER

# Set working directory to bench
WORKDIR /home/$FRAPPE_USER/hr-bench

# Install Frappe HR app
RUN bench get-app hr https://github.com/frappe/hr.git

# Create a new site for HR
RUN bench new-site hr.localhost \
    --db-host ${DB_HOST:-localhost} \
    --db-port ${DB_PORT:-3306} \
    --db-type mysql \
    --admin-password ${ADMIN_PASSWORD:-admin123}

# Install HR app in the site
RUN bench --site hr.localhost install-app hr

# Build assets
RUN bench build --app hr

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000 || exit 1

# Start command
CMD ["bench", "start"]
