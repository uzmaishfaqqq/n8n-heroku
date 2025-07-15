FROM n8nio/n8n:latest

USER root

# Create the custom nodes directory inside the n8n data folder
RUN mkdir -p /home/node/.n8n/custom/

# Copy your compiled custom nodes into the custom directory
# This assumes your custom_nodes_stg directory is at the root of your n8n-heroku repo
COPY ./custom_nodes_stg/ /home/node/.n8n/custom/

# Set ownership back to node user
USER node

WORKDIR /home/node/packages/cli
ENTRYPOINT []

COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
