#Stuff learned about Kafka while doing this

##Zookeeper
You need to use Zookeeper to use Kafka; ZK lets you co-ordinate
   multiple message-brokers in a distributed system. Even if you only
use one broker, you need to start Zookeeper first, then connect your
Kafka broker to it.

##VPN, `localhost`, and `advertised.host.name`

I couldn't make the Quickstart tutorial in the docs (https://kafka.apache.org/documentation.html#quickstart) work locally until I d/c'd from VPN.
In order to run it on the server, I changed the `advertised.host.name`
property in `server.properties` to the domain name of the server, and
then it worked OK

##Datastructure
 
* A _Producer_ sends a _message_ to a _topic_. The message is appended
  to the topic's log.
* A _Consumer_ reads messages from the _topic_. The Consumer can start
  reading at an _offset_. The consumer can remember where they left off
and resume at that point, start off at the current point in time, or
resume from a previous point (eg: the beginning)

##Autocreating topics

Should be able to make the kafka-node node.js client create topics, but
didn't get this to work yet. Had to create the `chatlog` topic using the
shellscript `kafka/bin/kafka-topics.sh`

##Timestamps ?

Kafka doesn't seem to wrap up, or add metadata to the messages, such as timestamps. Timestamps could be useful for consumers, but if created by producers, what guarantee is there that clocks are synched?



