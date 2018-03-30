FROM debian:9

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install --yes python-minimal systemd gnupg iproute2 sudo

RUN cd /lib/systemd/system/sysinit.target.wants/ && \
		ls | grep -v systemd-tmpfiles-setup.service | xargs rm -f && \
		rm -f /lib/systemd/system/sockets.target.wants/*udev* && \
		systemctl mask -- \
			tmp.mount \
			etc-hostname.mount \
			etc-hosts.mount \
			etc-resolv.conf.mount \
			-.mount \
			swap.target \
			getty.target \
			getty-static.service \
			dev-mqueue.mount \
			cgproxy.service \
			systemd-tmpfiles-setup-dev.service \
			systemd-remount-fs.service \
			systemd-ask-password-wall.path \
			systemd-logind.service && \
		systemctl set-default multi-user.target || true

RUN sed -ri /etc/systemd/journald.conf \
			-e 's!^#?Storage=.*!Storage=volatile!'

RUN ln -s /lib/systemd/systemd /sbin/init
