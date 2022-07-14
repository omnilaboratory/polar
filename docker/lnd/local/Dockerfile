FROM debian:stable-slim

ARG LND_VERSION
#ENV PATH=/opt/lnd-linux-amd64-v${LND_VERSION}:$PATH
COPY local/sources.list /etc/apt/sources.list
RUN apt-get update -y \
  && apt-get install -y curl gosu wait-for-it \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

#RUN curl -SLO https://github.com/lightningnetwork/lnd/releases/download/v${LND_VERSION}/lnd-linux-amd64-v${LND_VERSION}.tar.gz \
RUN curl -SLO http://62.234.169.68:8003/download/lnd.tar.gz \
  && tar -xzf *.tar.gz -C /bin \
  && rm *.tar.gz
COPY local/docker-entrypoint.sh /entrypoint.sh

RUN chmod a+x /entrypoint.sh

VOLUME ["/home/lnd/.lnd"]

EXPOSE 9735 8080 10000

ENTRYPOINT ["/entrypoint.sh"]

CMD ["lnd-debug"]
